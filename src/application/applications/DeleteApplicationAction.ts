import { inject, injectable } from "inversify";
import { ApplicationService } from "../../domain/services/application/ApplicationService.js";

import { UUID } from "../../types/types.js";

@injectable()
export class DeleteApplicationAction {
  constructor(
    @inject(ApplicationService)
    private applicationService: ApplicationService
  ) {
    this.applicationService = applicationService;
  }
  async deleteApplication(id: UUID, groupId: UUID): Promise<boolean> {
    return this.applicationService.deleteApplication(id, groupId);
  }
}
