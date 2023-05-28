import { GroupSummaryVO } from "../../../domain/valueObjects/application/GroupSummaryVO.js";

// extends from GroupSummaryVO to avoid de mapping but to show the separation of responsabilities

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGroupSummaryResponse extends GroupSummaryVO {}

export class GroupSummaryResponse {
  static fromGroupSummaryVO(group: GroupSummaryVO): IGroupSummaryResponse {
    return group
  }
}