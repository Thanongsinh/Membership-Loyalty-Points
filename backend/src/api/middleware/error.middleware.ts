import { Request, Response, NextFunction } from "express";
import { AppError } from "../../core/utilities/errors";
import { logger } from "../../core/logs/logger";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  logger.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
}
