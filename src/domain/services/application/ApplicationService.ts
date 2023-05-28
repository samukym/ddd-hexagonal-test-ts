import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/di/types.js";
import { timestamp, UUID } from "../../../types/types.js";
import { Application } from "../../entities/Application.js";
import { Group } from "../../entities/Group.js";
import { NotFoundError } from "../../errors/Errors.js";
import { IGroupRepository } from "../../repositories/IGroupRespository.js";

@injectable()
export class ApplicationService {
  constructor(
    @inject(TYPES.GroupRepository)
    private groupRespository: IGroupRepository
  ) {
    this.groupRespository = groupRespository;
  }
  async registerHeartbeat(id: UUID, groupId: UUID, meta?: object): Promise<Group> {
    let groupWithApp = await this.groupRespository.getGroupWithOneApplication(groupId, id);
    if (!groupWithApp) {
      groupWithApp = Group.createGroup(groupId);
      await this.groupRespository.createGroup(groupWithApp);
    }
    if (groupWithApp.applications[0]) {
      groupWithApp.applications[0].updatedAt = Date.now();
      groupWithApp.applications[0].meta = meta;
    } else {
      groupWithApp.applications[0] = Application.createApplication(id, meta);
    }
    await this.groupRespository.addOrUpdateGroupApplication(groupId, groupWithApp.applications[0]);
    return groupWithApp;
  }

  async deleteApplication(id: UUID, groupId: UUID): Promise<boolean> {
    const wasAppDeleted = await this.groupRespository.deleteGroupApplication(groupId, id);
    if (!wasAppDeleted) {
      throw new NotFoundError(id);
    }
    return true;
  }

  async deleteExpiredApplications(ageInSeconds: number): Promise<void> {    
    const dateAgeAgo: timestamp = Date.now() - ageInSeconds * 1000;
    await this.groupRespository.deleteApplicationsOlderThan(dateAgeAgo);
  }
}
