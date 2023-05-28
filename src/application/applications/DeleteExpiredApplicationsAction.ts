import { inject, injectable } from "inversify";
import { ApplicationService } from "../../domain/services/application/ApplicationService.js";

@injectable()
export class DeleteExpiredApplicationsAction {
  constructor(@inject(ApplicationService) private applicationService: ApplicationService) {
    this.applicationService = applicationService;
  }
  async start(ageInSecs: number, intervalInSecs: number): Promise<void> {
    if (intervalInSecs > -1) {
      setInterval(() => {
        this.applicationService.deleteExpiredApplications(ageInSecs);
      }, intervalInSecs * 1000);
    }
  }
}
