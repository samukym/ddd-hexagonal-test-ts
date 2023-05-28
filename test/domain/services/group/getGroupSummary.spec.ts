import "reflect-metadata";
import { expect } from "chai";
import sinon from "sinon";
import { Application } from "../../../../src/domain/entities/Application.js";
import { GroupSummaryVO } from "../../../../src/domain/valueObjects/application/GroupSummaryVO.js";
import { GroupRespository } from "../../../../src/infrastructure/data-sources/persistance/group/GroupRepository.js";
import { GroupService } from "../../../../src/domain/services/group/GroupService.js";
import { Group } from "../../../../src/domain/entities/Group.js";

let groupServiceSUT: GroupService;

const firstHeartbeat = Date.now();
const lastHeartbeat = Date.now();
const applications_A = [
  Application.createApplication("random-uuid-1", undefined),
  Application.createApplication("random-uuid-2"),
  Application.createApplication("random-uuid-3", undefined, undefined, lastHeartbeat),
];
const applications_B = [
  Application.createApplication("random-uuid-1", undefined, firstHeartbeat),
  Application.createApplication("random-uuid-2"),
  Application.createApplication("random-uuid-3"),
];
const groups = [
  Group.createGroup("random-uuid-group-1", undefined, applications_A),
  Group.createGroup("random-uuid-group-2", undefined, applications_B),
  Group.createGroup("random-uuid-group-3", undefined, []),
];

describe("GroupService => getGroupsSummary", () => {
  let actualGroupSummary: Array<GroupSummaryVO>;
  describe("when returns the groups summary", async () => {
    after(() => {
      sinon.restore();
    });
    before(async () => {
      sinon.stub(GroupRespository.prototype, "getAllGroups").resolves(groups);
      groupServiceSUT = new GroupService(new GroupRespository({} as any));
      actualGroupSummary = await groupServiceSUT.getGroupsSummary();
    });
    it("should contain the number of applications that belongs to the group", async () => {
      expect(actualGroupSummary[0].instances).to.be.eql(applications_A.length); // because all are in the same gruop
    });
    it("should contain the timestamp of the first heartbeat register in the group", async () => {
      expect(actualGroupSummary[1].firstHeartbeat).to.be.eql(firstHeartbeat);
    });
    it("should contain the timestamp of the last heartbeat register in the group", async () => {
      expect(actualGroupSummary[0].lastHeartbeat).to.be.eql(lastHeartbeat);
    });
    it("should do not count groups with no instannces", async () => {
      const numberOfGroupsWithNoApps = 1;
      expect(actualGroupSummary.length).to.be.eq(
        groups.length - numberOfGroupsWithNoApps
      );
    });
  });
});
