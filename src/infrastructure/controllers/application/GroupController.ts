import { inject } from "inversify";
import {
  controller,
  BaseHttpController,
  interfaces,
  requestParam,
  httpGet,
} from "inversify-express-utils";
import {
  BadRequestResult,
  OkNegotiatedContentResult,
} from "inversify-express-utils/lib/results";
import { GetGroupsSummaryAction } from "../../../application/groups/GetGroupsSummaryAction.js";
import { IGroupSummaryResponse } from "../../../application/groups/responsesObjects/GroupSummaryResponse.js";

import { UUID } from "../../../types/types.js";
import { handleErrorOnAllFunctions } from "../utils/decorators/errorHandler.js";
import { isUUIDValid } from "../utils/ParamCheckers.js";

@handleErrorOnAllFunctions
@controller("/groups")
export class GroupController extends BaseHttpController implements interfaces.Controller {
  constructor(
    @inject(GetGroupsSummaryAction)
    private getGroupsSummaryAction: GetGroupsSummaryAction
  ) {
    super();
  }

  @httpGet("/summary")
  async getGroupsSummary(
  ): Promise<OkNegotiatedContentResult<Array<IGroupSummaryResponse>>> {
    const groupsSummary = await this.getGroupsSummaryAction.getGroupsSummary();
    return this.ok<Array<IGroupSummaryResponse>>(groupsSummary);
  }
}
