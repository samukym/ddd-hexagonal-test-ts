import { timestamp, UUID } from "../../types/types.js";

export class Application {
  id: UUID;
  createdAt: timestamp;
  updatedAt: timestamp;
  meta?: object;
  private constructor(
    id: UUID,
    createdAt: timestamp,
    updatedAt: timestamp,
    meta?: object
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.meta = meta;
  }

  static createApplication(
    id: UUID,
    meta?: object,
    createdAt = Date.now(),
    updatedAt = Date.now(),
    ) {
    return new Application(id, createdAt, updatedAt, meta);
  }
}
