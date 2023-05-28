import { BadRequestResult } from "inversify-express-utils/lib/results/BadRequestResult.js";
import "reflect-metadata";
import { DomainErrors, NotFoundError } from "../../../../domain/errors/Errors.js";

function handleErrorByFunction(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>
) {
  const method = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    try {
      return await method.apply(this, args);
    } catch (err) {
      console.error(err);
      // Domain Error
      if (err instanceof DomainErrors) {
        if (err instanceof NotFoundError) {
          return target.notFound();
        }
      } 
      // Exceptions and Http errors
      else {
        if (err instanceof BadRequestResult) {
          return target.badRequest();
        } else {
          return target.internalServerError();
        }
      }
    }
  };
}

export function handleErrorOnAllFunctions(target: any) {
  const targetPrototype = target.prototype;
  for (const propertyName of Object.getOwnPropertyNames(targetPrototype)) {
    const descriptor = Object.getOwnPropertyDescriptor(targetPrototype, propertyName);
    const isMethod = descriptor!.value instanceof Function;
    if (!isMethod || propertyName === "constructor" || !descriptor) continue;
    handleErrorByFunction(targetPrototype, propertyName, descriptor);
    Object.defineProperty(targetPrototype, propertyName, descriptor!);
  }
}
