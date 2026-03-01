import express from "express";
import cors from "cors";
import { bootstrap } from "./bootstrap/app";
import { logger } from "./core/logs/logger";
import { config } from "./core/utilities/config";

const app = express();

app.use(cors());
app.use(express.json());

bootstrap(app);

const PORT = config.App.port || 3001;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
