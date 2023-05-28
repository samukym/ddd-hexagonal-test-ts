import express from "express";
import container from "./infrastructure/di/container.js";
import { InversifyExpressServer } from "inversify-express-utils";

// Controllers
import "./infrastructure/controllers/application/ApplicationController.js";
import "./infrastructure/controllers/application/GroupController.js";

const app = new InversifyExpressServer(container, null, { rootPath: "/api/v1" });

app.setConfig((app) => {
  // Express configuration
  app.set("port", process.env.PORT ?? 3000);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
});

export default app;
