import { inject } from "inversify";
import {
  controller,
  BaseHttpController,
  interfaces,
  requestParam,
  httpPost,
  requestBody,
  httpDelete,
  httpGet,
} from "inversify-express-utils";
import {
  BadRequestResult,
  ExceptionResult,
  OkNegotiatedContentResult,
  OkResult,
} from "inversify-express-utils/lib/results";
import { IApplicationResponse } from "../../../application/applications/responsesObjects/ApplicationResponse.js";
import { DeleteApplicationAction } from "../../../application/applications/DeleteApplicationAction.js";
import { GetGroupApplicationsAction } from "../../../application/applications/GetGroupApplicationsAction.js";
import { RegisterApplicationHeartbeatAction } from "../../../application/applications/RegisterApplicationHeartbeatAction.js";

import { UUID } from "../../../types/types.js";
import { handleErrorOnAllFunctions } from "../utils/decorators/errorHandler.js";
import { isUUIDValid } from "../utils/ParamCheckers.js";

@handleErrorOnAllFunctions
@controller("/groups/:group_id/apps")
export class ApplicationsController extends BaseHttpController implements interfaces.Controller {
  constructor(
    @inject(RegisterApplicationHeartbeatAction)
    private registerAppHeartbeatAction: RegisterApplicationHeartbeatAction,
    @inject(DeleteApplicationAction)
    private deleteApplicationAction: DeleteApplicationAction,
    @inject(GetGroupApplicationsAction)
    private getGroupApplicationsAction: GetGroupApplicationsAction
  ) {
    super();
    this.registerAppHeartbeatAction = registerAppHeartbeatAction;
  }
  @httpPost("/:app_id")
  async registerHeartbeat(
    @requestParam("app_id") appId: UUID,
    @requestParam("group_id") groupId: UUID,
    @requestBody() body?: object
  ): Promise<OkNegotiatedContentResult<IApplicationResponse> | BadRequestResult> {
    if (!isUUIDValid(appId) || !isUUIDValid(groupId)) {
      return this.badRequest();
    }
    const application = await this.registerAppHeartbeatAction.registerHeartbeat(
      appId,
      groupId,
      body
    );
    return this.ok<IApplicationResponse>(application);
  }

  @httpDelete("/:app_id")
  async deleteApplication(
    @requestParam("app_id") appId: UUID,
    @requestParam("group_id") groupId: UUID
  ): Promise<OkResult | BadRequestResult | ExceptionResult> {
    if (!isUUIDValid(appId) || !isUUIDValid(groupId)) {
      return this.badRequest();
    }
    await this.deleteApplicationAction.deleteApplication(appId, groupId);
    return this.ok();
  }

  @httpGet("/")
  async getGroupApplications(
    @requestParam("group_id") groupId: UUID
  ): Promise<
    OkNegotiatedContentResult<Array<IApplicationResponse>> | BadRequestResult | ExceptionResult
  > {
    if (!isUUIDValid(groupId)) {
      return this.badRequest();
    }
    const groupApplications = await this.getGroupApplicationsAction.getGroupApplications(groupId);
    return this.ok<Array<IApplicationResponse>>(groupApplications);
  }
}
