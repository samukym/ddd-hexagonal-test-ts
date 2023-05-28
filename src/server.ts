/* eslint-disable no-console */
import app from "./app.js";
import { DeleteExpiredApplicationsAction } from "./application/applications/DeleteExpiredApplicationsAction.js";
import DIContainer from "./infrastructure/di/container.js";
import * as dotenv from "dotenv";
import { TYPES } from "./infrastructure/di/types.js";
const config = dotenv.config({ path: "config/.env" });
if (config.error) {
  throw config.error;
}

const expressApp = app.build();
/**
 * Start Express server.
 */
const server = expressApp.listen(expressApp.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    expressApp.get("port"),
    expressApp.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

/**
 * Start deleteExpiredApplicationsAction
 */
const age = process.env.AGE_APPS_IN_SECS;
const interval = process.env.DELETE_EXPIRED_APPS_SECS;
if (!age || !interval) {
  throw new Error("Age or interval not setted in conf");
}
const deleteExpiredApplicationsAction = DIContainer.get<DeleteExpiredApplicationsAction>(TYPES.DeleteExpiredApplicationsAction);
deleteExpiredApplicationsAction.start(+age, +interval);


export default server;
