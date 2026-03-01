import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { bootstrap } from "./bootstrap/app";
import { logger } from "./core/logs/logger";
import { config } from "./core/utilities/config";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});
app.use("/api/", limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many auth attempts, please try again later" },
});
app.use("/api/auth/", authLimiter);

bootstrap(app);

const PORT = config.App.port || 3001;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
