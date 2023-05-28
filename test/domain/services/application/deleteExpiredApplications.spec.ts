import "reflect-metadata";
import { expect } from "chai";
import { Application } from "../../../../src/domain/entities/Application.js";
import { Group } from "../../../../src/domain/entities/Group.js";
import { ApplicationService } from "../../../../src/domain/services/application/ApplicationService.js";
import { IGroupModel } from "../../../../src/infrastructure/data-sources/persistance/group/GroupMapper.js";
import { GroupRespository } from "../../../../src/infrastructure/data-sources/persistance/group/GroupRepository.js";
import { InMemoryDb } from "../../../../src/infrastructure/inMemoryDB/InMemoryDb.js";

let applicationServiceSUT: ApplicationService;
let inMemoryDb: InMemoryDb<IGroupModel>;
const oldDate = new Date("2010-01-01").getTime();

const groupIdA = "random-uuid-group-1";
const groupIdB = "random-uuid-group-2";
const groupIdC = "random-uuid-group-3";

const applications_A = [
  Application.createApplication("random-uuid-3", undefined, undefined, oldDate),
];
const applications_B = [
  Application.createApplication("random-uuid-1", undefined, undefined, oldDate),
  Application.createApplication("random-uuid-2"),
  Application.createApplication("random-uuid-3", undefined, undefined, oldDate),
];
const groups = [
  Group.createGroup(groupIdA, undefined, applications_A),
  Group.createGroup(groupIdB, undefined, applications_B),
  Group.createGroup(groupIdC, undefined, []),
];

describe("ApplicationService => deleteExpiredApplications", () => {
  after(() => inMemoryDb.flushall);
  before(async () => {
    inMemoryDb = new InMemoryDb<IGroupModel>();
    applicationServiceSUT = new ApplicationService(new GroupRespository(inMemoryDb));
    for (const group of groups) {
      await inMemoryDb.upsert(JSON.parse(JSON.stringify(group)));
    }
  });
  it("should remove applications older that age stablished", async () => {
    const oneMinAge = 60;
    await applicationServiceSUT.deleteExpiredApplications(oneMinAge);

    const groupA = await inMemoryDb.getOneById(groupIdA);
    const numberOfExpiredAppsInGroupA = 1;
    expect(groupA?.applications.length).to.be.eq(
      applications_A.length - numberOfExpiredAppsInGroupA
    );

    const groupB = await inMemoryDb.getOneById(groupIdB);
    const numberOfExpiredAppsInGroupB = 2;
    expect(groupB?.applications.length).to.be.eq(
      applications_B.length - numberOfExpiredAppsInGroupB
    );
  });
});
