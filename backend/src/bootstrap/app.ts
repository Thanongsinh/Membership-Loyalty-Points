import { Express } from "express";
import { router } from "../api/routes";

export function bootstrap(app: Express): void {
  app.use("/api", router);
}
