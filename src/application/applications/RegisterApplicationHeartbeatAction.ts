import { inject, injectable } from "inversify";
import { ApplicationService } from "../../domain/services/application/ApplicationService.js";

import { UUID } from "../../types/types.js";
import {
  ApplicationResponse,
  IApplicationResponse,
} from "./responsesObjects/ApplicationResponse.js";

@injectable()
export class RegisterApplicationHeartbeatAction {
  constructor(
    @inject(ApplicationService)
    private applicationService: ApplicationService
  ) {
    this.applicationService = applicationService;
  }
  async registerHeartbeat(
    id: UUID,
    groupId: UUID,
    meta?: object
  ): Promise<IApplicationResponse> {
    const groupWithApp = await this.applicationService.registerHeartbeat(id, groupId, meta);    
    return ApplicationResponse.fromApplication(groupWithApp.applications[0], groupWithApp.id);
  }
}
