import { inject, injectable } from "inversify";
import { Application } from "../../../../domain/entities/Application.js";
import { Group } from "../../../../domain/entities/Group.js";
import { IGroupRepository } from "../../../../domain/repositories/IGroupRespository.js";
import { InMemoryDb } from "../../../inMemoryDB/InMemoryDb.js";
import { ApplicationMapper } from "../application/ApplicationMapper.js";
import { GroupMapper, IGroupModel } from "./GroupMapper.js";

/**
 * Note of implementation:
 * It does not scale at all. It has to fetch all Applications from the  object and then filter.
 * If it has millions os applications records would perform horrible.
 * The only reason I made it like this is becauase I didn't want to use a real database
 */
@injectable()
export class GroupRespository implements IGroupRepository {
  constructor(@inject(InMemoryDb) private db: InMemoryDb<IGroupModel>) {
    this.db = db;
  }

  async deleteApplicationsOlderThan(date: number): Promise<void> {
    const groups = await this.db.getAll();
    const groupsToUpdate: Array<Promise<void>> = [];
    groups.forEach((group) => {
      group.applications = group.applications.filter(
        (app) => new Date(app.updatedAt) > new Date(date)
      );
      groupsToUpdate.push(this.db.upsert(group));
    });
    await Promise.all(groupsToUpdate);
  }
  async getAllGroups(): Promise<Array<Group>> {
    return (await this.db.getAll()).map(GroupMapper.toDomain);
  }
  async createGroup(group: Group): Promise<void> {
    return await this.db.upsert(GroupMapper.fromDomain(group));
  }
  async addOrUpdateGroupApplication(groupId: string, application: Application): Promise<void> {
    const group = await this.db.getOneById(groupId);
    if (!group) {
      return;
    }
    const indexApp = group.applications.findIndex((app) => app.id === application.id);
    if (indexApp < 0) {
      group.applications = [ApplicationMapper.fromDomain(application), ...group.applications];
    } else {
      group.applications[indexApp] = ApplicationMapper.fromDomain(application);
    }
    await this.db.upsert(group);
  }
  async getGroupWithOneApplication(
    groupId: string,
    applicationId: string
  ): Promise<Group | undefined> {
    const group = await this.db.getOneById(groupId);
    if (!group) {
      return;
    }
    group.applications = group.applications
      .filter((app) => (app.id = applicationId))
      .map(ApplicationMapper.toDomain);
    return GroupMapper.toDomain(group);
  }
  async getGroupWithApplications(groupId: string): Promise<Group | undefined> {
    const group = await this.db.getOneById(groupId);
    if (!group) {
      return;
    }
    return GroupMapper.toDomain(group);
  }
  async deleteGroupApplication(groupId: string, applicationId: string): Promise<boolean> {
    const group = await this.db.getOneById(groupId);
    if (!group) {
      return false;
    }
    const appIndexToDelete = group.applications.findIndex((app) => app.id === applicationId);
    if (appIndexToDelete < 0) {
      return false;
    }
    group.applications.splice(appIndexToDelete, 1);
    await this.db.upsert(group);
    return true;
  }
}
