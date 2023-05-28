import { timestamp, UUID } from "../../types/types.js";
import { Application } from "../entities/Application.js";
import { Group } from "../entities/Group.js";

export interface IGroupRepository {
  getGroupWithOneApplication(groupId: UUID, applicationId: UUID): Promise<Group | undefined>;
  getGroupWithApplications(groupId: UUID): Promise<Group | undefined>;
  getAllGroups(): Promise<Array<Group>>;
  deleteGroupApplication(groupId: UUID, applicationId: UUID): Promise<boolean>;
  deleteApplicationsOlderThan(date: timestamp): Promise<void>;
  addOrUpdateGroupApplication(groupId: UUID, application: Application): Promise<void>;
  createGroup(group: Group): Promise<void>
}
