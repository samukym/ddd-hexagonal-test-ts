import { inject, injectable } from "inversify";
import { GroupService } from "../../domain/services/group/GroupService.js";
import { GroupSummaryResponse, IGroupSummaryResponse } from "./responsesObjects/GroupSummaryResponse.js";

@injectable()
export class GetGroupsSummaryAction {
  constructor(
    @inject(GroupService)
    private groupService: GroupService
  ) {}
  async getGroupsSummary(): Promise<Array<IGroupSummaryResponse>> {
    const groupsSummary = await this.groupService.getGroupsSummary();
    return groupsSummary.map((group) => GroupSummaryResponse.fromGroupSummaryVO(group));
  }
}
