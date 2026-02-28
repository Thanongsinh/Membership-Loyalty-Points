import express from "express";
import cors from "cors";
import { bootstrap } from "./bootstrap/app";
import { logger } from "./core/logs/logger";

const app = express();

app.use(cors());
app.use(express.json());

bootstrap(app);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
