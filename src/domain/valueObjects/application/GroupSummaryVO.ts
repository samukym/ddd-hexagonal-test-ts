import { timestamp, UUID } from "../../../types/types.js";

export class GroupSummaryVO {
  groupId: UUID;
  instances: number;
  firstHeartbeat?: timestamp;
  lastHeartbeat?: timestamp;
  private constructor(
    groupId: UUID,
    instances: number,
    firstHeartbeat?: timestamp,
    lastHeartbeat?: timestamp
  ) {
    this.groupId = groupId;
    this.instances = instances;
    this.firstHeartbeat = firstHeartbeat;
    this.lastHeartbeat = lastHeartbeat;
  }

  static create(
    groupId: UUID,
    instances: number,
    firstHeartbeat?: timestamp,
    lastHeartbeat?: timestamp
  ): GroupSummaryVO {
    return new GroupSummaryVO(groupId, instances, firstHeartbeat, lastHeartbeat);
  }
}
