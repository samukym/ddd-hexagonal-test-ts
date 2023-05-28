import { inject, injectable } from "inversify";
import { GroupService } from "../../domain/services/group/GroupService.js";
import { UUID } from "../../types/types.js";
import { ApplicationResponse, IApplicationResponse } from "./responsesObjects/ApplicationResponse.js";

@injectable()
export class GetGroupApplicationsAction {
  constructor(
    @inject(GroupService)
    private groupService: GroupService
  ) {}
  async getGroupApplications(groupId: UUID): Promise<Array<IApplicationResponse>> {
    const group = await this.groupService.getGroup(groupId);
    return group.applications.map((app) => ApplicationResponse.fromApplication(app, groupId));
  }
}
