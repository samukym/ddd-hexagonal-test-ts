import "reflect-metadata";
import { expect } from "chai";
import { ApplicationsController } from "../../../../src/infrastructure/controllers/application/ApplicationController.js";
import { InMemoryDb } from "../../../../src/infrastructure/inMemoryDB/InMemoryDb.js";
import { BadRequestResult } from "inversify-express-utils/lib/results/BadRequestResult.js";
import { ExceptionResult } from "inversify-express-utils/lib/results/ExceptionResult.js";
import { RegisterApplicationHeartbeatAction } from "../../../../src/application/applications/RegisterApplicationHeartbeatAction.js";
import { ApplicationService } from "../../../../src/domain/services/application/ApplicationService.js";
import { OkNegotiatedContentResult } from "inversify-express-utils/lib/results/OkNegotiatedContentResult.js";
import { IApplicationResponse } from "../../../../src/application/applications/responsesObjects/ApplicationResponse.js";
import { GroupRespository } from "../../../../src/infrastructure/data-sources/persistance/group/GroupRepository.js";
import { IGroupModel } from "../../../../src/infrastructure/data-sources/persistance/group/GroupMapper.js";
import { Group } from "../../../../src/domain/entities/Group.js";

let applicationControllerSUT: ApplicationsController;

const appId = "64dce9ef-bb36-4a92-9216-da5ff385ca39";
const groupId = "64dce9ef-bb36-4a92-9216-da5ff382ca40";
const nonExistingGroupId = "64dce9ef-bb36-4a92-9216-da5ff382ca30";
const meta = { foo: "bar" };
let inMemoryDb: InMemoryDb<IGroupModel>;
describe("ClientAppsController => registerHeartbeat", () => {
  after(() => {
    after(() => inMemoryDb.flushall());
  });
  before(() => {
    inMemoryDb = new InMemoryDb<IGroupModel>();
    applicationControllerSUT = new ApplicationsController(
      new RegisterApplicationHeartbeatAction(
        new ApplicationService(new GroupRespository(inMemoryDb))
      ),
      {} as any,
      {} as any
    );
  });
  describe("when a client application sends a heartbeat (ping)", async () => {
    let response:
      | OkNegotiatedContentResult<IApplicationResponse>
      | BadRequestResult
      | ExceptionResult;
    describe("to a non-existing group", () => {
      before(async () => {
        response = await applicationControllerSUT.registerHeartbeat(
          appId,
          nonExistingGroupId,
          meta
        );
      });
      it("should return the created group", async () => {
        // const group = await inMemoryDb.getOneById(groupId);
        const responseHttp = await response.executeAsync();
        const applicationResponse: IApplicationResponse = JSON.parse(
          await responseHttp.content.readAsStringAsync()
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, ...clientAppInputData } = applicationResponse!;
        expect(clientAppInputData).to.be.eql({ id: appId, groupId: nonExistingGroupId, meta });
      });
    });
    describe("to a existing group", () => {
      describe("to an unregistered app", () => {
        before(async () => {
          await inMemoryDb.upsert(Group.createGroup(groupId));
          response = await applicationControllerSUT.registerHeartbeat(appId, groupId, meta);
        });
        it("should return an OK", async () => {
          expect(response).to.be.instanceOf(OkNegotiatedContentResult<IApplicationResponse>);
        });
        it("should return the app instance object", async () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const responseHttp = await response.executeAsync();
          const applicationResponse: IApplicationResponse = JSON.parse(
            await responseHttp.content.readAsStringAsync()
          );
          const { createdAt, updatedAt, ...clientAppInputData } = applicationResponse;
          expect(clientAppInputData).to.be.eql({ id: appId, groupId, meta });
        });
        it("should create the app instance", async () => {
          const group = await inMemoryDb.getOneById(groupId);
          const insertedApplication = group?.applications.find((app) => app.id === appId);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { createdAt, updatedAt, ...clientAppInputData } = insertedApplication!;
          expect(clientAppInputData.id).to.be.eql(appId);
        });
      });
      describe("with some missing parameter", () => {
        it("should return Bad Request if it is the app id paramenter ", async () => {
          response = await applicationControllerSUT.registerHeartbeat(undefined!, groupId, meta);
          expect(response).to.be.instanceOf(BadRequestResult);
        });
        it("should return Bad Request if it is the group id paramenter", async () => {
          response = await applicationControllerSUT.registerHeartbeat(appId, undefined!, meta);
          expect(response).to.be.instanceOf(BadRequestResult);
        });
        it("should return OK if the parameter is the metadata", async () => {
          response = await applicationControllerSUT.registerHeartbeat(appId, groupId, undefined);
          expect(response).to.be.instanceOf(OkNegotiatedContentResult<IApplicationResponse>);
        });
      });
    });
  });
});
