import { timestamp, UUID } from "../../../types/types.js";
import { Application } from "../../../domain/entities/Application.js";

// use it for documentation
export interface IApplicationResponse {
  id: UUID;
  groupId: UUID;
  createdAt: timestamp;
  updatedAt: timestamp;
  meta?: object;
}

export class ApplicationResponse {
  static fromApplication(application: Application, groupId: UUID): IApplicationResponse {
    const applicationResponse: IApplicationResponse = {
      id: application.id,
      groupId: groupId,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      meta: application.meta,
    };
    return applicationResponse;
  }
}