import { Express } from "express";
import { router } from "../api/routes";
import { errorHandler } from "../api/middleware/error.middleware";

export function bootstrap(app: Express): void {
  app.use("/api", router);
  app.use(errorHandler);
}
