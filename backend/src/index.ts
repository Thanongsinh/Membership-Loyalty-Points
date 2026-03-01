import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { bootstrap } from "./bootstrap/app";
import { logger } from "./core/logs/logger";
import { config } from "./core/utilities/config";
import { startPointsExpiryJob } from "./core/jobs/points-expiry.job";
import { startStockAlertJob } from "./core/jobs/stock-alert.job";
import { sseService } from "./data/services/sse.service";
import { authenticate } from "./api/middleware/auth.middleware";
import { swaggerSpec } from "./swagger.config";

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

// Serve uploaded images
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// Swagger UI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Membership & Loyalty Points API Docs',
}));

bootstrap(app);

// SSE endpoint for real-time order status
app.get("/api/sse/orders", authenticate as any, (req: any, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("data: connected\n\n");
  sseService.addClient(req.user.userId, res);
});

// Start cron jobs
startPointsExpiryJob();
startStockAlertJob();

const PORT = config.App.port || 3001;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
