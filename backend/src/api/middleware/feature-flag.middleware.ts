import { Request, Response, NextFunction } from "express";
import { featureFlagService } from "../../data/services/feature-flag.service";
import { AppError } from "../../core/utilities/errors";

export function requireFeature(featureKey: string) {
  return async (_req: Request, _res: Response, next: NextFunction) => {
    const enabled = await featureFlagService.isEnabled(featureKey);
    if (!enabled) {
      return next(new AppError(403, `Feature "${featureKey}" is currently disabled`));
    }
    next();
  };
}
