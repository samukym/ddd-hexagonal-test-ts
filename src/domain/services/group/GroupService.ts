import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/di/types.js";
import { timestamp, UUID } from "../../../types/types.js";
import { Application } from "../../entities/Application.js";
import { Group } from "../../entities/Group.js";
import { NotFoundError } from "../../errors/Errors.js";
import { IGroupRepository } from "../../repositories/IGroupRespository.js";
import { GroupSummaryVO } from "../../valueObjects/application/GroupSummaryVO.js";

@injectable()
export class GroupService {
  constructor(
    @inject(TYPES.GroupRepository)
    private groupRespository: IGroupRepository
  ) {
    this.groupRespository = groupRespository;
  }

  async getGroupsSummary(): Promise<Array<GroupSummaryVO>> {
    const groups = await this.groupRespository.getAllGroups();
    return groups
      .map((group) => this.getGroupSummary(group))
      .filter((group) => group.instances > 0);
  }

  async getGroup(groupId: UUID): Promise<Group> {
    const group = await this.groupRespository.getGroupWithApplications(groupId);
    if (!group) {
      throw new NotFoundError(groupId);
    }
    return group;
  }

  private getGroupSummary(group: Group): GroupSummaryVO {
    const instances = group.applications.length;
    const firstHeartbeat = this.findOldestHeartbeat(group.applications);
    const lastHeartbeat = this.findMostRecentHeartbeat(group.applications);
    return GroupSummaryVO.create(group.id, instances, firstHeartbeat, lastHeartbeat);
  }
  // TODO: refactor extract method
  private findOldestHeartbeat(apps: Array<Application> = []): timestamp | undefined {
    if (apps.length === 0) {
      return;
    }
    let oldest = apps[0];
    for (let i = 1; i < apps.length; i++) {
      if (apps[i].createdAt < oldest.createdAt) {
        oldest = apps[i];
      }
    }
    return oldest.createdAt;
  }

  private findMostRecentHeartbeat(apps: Array<Application> = []): timestamp | undefined {
    if (apps.length === 0) {
      return;
    }
    let mostRecent = apps[0];
    for (let i = 1; i < apps.length; i++) {
      if (apps[i].updatedAt < mostRecent.updatedAt) {
        mostRecent = apps[i];
      }
    }
    return mostRecent.updatedAt;
  }
}
