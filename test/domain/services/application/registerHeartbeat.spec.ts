import "reflect-metadata";
import { expect } from "chai";
import sinon, { SinonStub } from "sinon";
import { ApplicationService } from "../../../../src/domain/services/application/ApplicationService.js";
import { Application } from "../../../../src/domain/entities/Application.js";
import { GroupRespository } from "../../../../src/infrastructure/data-sources/persistance/group/GroupRepository.js";
import chaiAsPromised from "chai-as-promised";
import chai from "chai";
import { Group } from "../../../../src/domain/entities/Group.js";

chai.use(chaiAsPromised);

let applicationServiceSUT: ApplicationService;

const appId = "random-app-uuid-1";
const groupId = "random-group-uuid-2";
const lastUpdatedAt = new Date("2010-01-01").getTime();
const meta = { foo: "bar" };
const applications = [Application.createApplication(appId, meta, undefined, lastUpdatedAt)];
const group = Group.createGroup(groupId, "group-label", applications);
describe("ApplicationService => registerHeartbeat", () => {
  describe("when the system receives a heartbeat", () => {
    let getGroupWithOneApplicationStub: SinonStub;
    let addOrUpdateGroupApplicationStub: SinonStub;
    after(() => {
      sinon.restore();
    });
    before(() => {
      getGroupWithOneApplicationStub = sinon.stub(
        GroupRespository.prototype,
        "getGroupWithOneApplication"
      );
      addOrUpdateGroupApplicationStub = sinon.stub(
        GroupRespository.prototype,
        "addOrUpdateGroupApplication"
      );
      applicationServiceSUT = new ApplicationService(new GroupRespository(null as any));
    });
    describe("pointing to group that does not exist", () => {
      let createGroupStub: SinonStub;
      after(() => getGroupWithOneApplicationStub.reset());
      before(() => {
        getGroupWithOneApplicationStub.resolves(undefined);
        createGroupStub = sinon.stub(GroupRespository.prototype, "createGroup");
      });
      it("should create a new one", async () => {
        await applicationServiceSUT.registerHeartbeat(appId, groupId);
        expect(createGroupStub.calledOnce).to.be.true;
      });
    });
    describe("pointing to an application instance that does not exist", () => {
      after(() => getGroupWithOneApplicationStub.reset());
      before(() => {
        const groupWithNoApplications = Object.assign({}, group);
        groupWithNoApplications.applications = [];
        getGroupWithOneApplicationStub.resolves(groupWithNoApplications);
      });
      it("should create a new one", async () => {
        await applicationServiceSUT.registerHeartbeat(appId, groupId, meta);
        expect(addOrUpdateGroupApplicationStub.args[0][1]["id"]).to.be.eq(appId);
      });
    });
    // TODO: use rewiremock (for example) to spy the createApplication method in the Application Entity to set an older updatedAt vale. 
    // I could have tested with an integrated test with the db but I wanted to keep domain tests as unit test.
    describe.skip("pointing to an application and group that exist", () => {
      const existingGroupApplication = Group.createGroup(group.id, group.label, group.applications);
      before(() => {
        getGroupWithOneApplicationStub.resolves(existingGroupApplication);
      });
      it("should update the updatedAt field", async () => {
        await applicationServiceSUT.registerHeartbeat(appId, groupId, meta);
        expect(new Date(addOrUpdateGroupApplicationStub.args[0][0]["updatedAt"])).to.be.gt(
          lastUpdatedAt
        );
      });
      it("should update the meta field if it chages", async () => {
        const newMeta = { meta: "metadata" };
        await applicationServiceSUT.registerHeartbeat(appId, groupId, newMeta);
        expect(addOrUpdateGroupApplicationStub.args[0][0]["meta"]).to.be.eq(newMeta);
      });
    });
  });
});
