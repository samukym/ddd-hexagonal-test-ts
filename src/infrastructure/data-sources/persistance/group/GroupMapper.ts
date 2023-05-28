import { Group } from "../../../../domain/entities/Group.js";
import { UUID } from "../../../../types/types.js";
import { IApplicationModel } from "../application/ApplicationMapper.js";
/**
 * Database Model
 */
export interface IGroupModel {
  id: UUID;
  label?: string;
  applications: Array<IApplicationModel>;
}

export class GroupMapper {
  static fromDomain(group: Group): IGroupModel {
    return {
      id: group.id,
      applications: group.applications,
      label: group.label,
    };
  }
  static toDomain(groupModel: IGroupModel): Group {
    return {
      id: groupModel.id,
      applications: groupModel.applications,
      label: groupModel.label,
    };
  }
}
