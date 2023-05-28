import { UUID } from "../../types/types.js";

export class DomainErrors extends Error {}

export class NotFoundError extends DomainErrors {
  constructor(id?: UUID) {
    const msg = `Entity with id ${id} not found`;
    super(msg);
  }
}
