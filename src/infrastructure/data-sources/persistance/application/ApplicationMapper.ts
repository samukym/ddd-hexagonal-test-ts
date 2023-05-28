import { Application } from "../../../../domain/entities/Application.js";
import { timestamp, UUID } from "../../../../types/types.js";
/**
 * Database Model
 */
export interface IApplicationModel {
  id: UUID;
  createdAt: timestamp;
  updatedAt: timestamp;
  meta?: object;
}

export class ApplicationMapper {
  static fromDomain(application: Application): IApplicationModel {
    return {
      id: application.id,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      meta: application.meta,
    };
  }
  static toDomain(applicationModel: IApplicationModel): Application {
    return {
      id: applicationModel.id,
      createdAt: applicationModel.createdAt,
      updatedAt: applicationModel.updatedAt,
      meta: applicationModel.meta,
    };
  }
}
