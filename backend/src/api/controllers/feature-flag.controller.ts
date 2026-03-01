import { Request, Response } from "express";
import { asyncHandler } from "../../core/utilities/errors";
import { featureFlagService } from "../../data/services/feature-flag.service";
import { auditLogService } from "../../data/services/audit-log.service";

export const featureFlagController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const flags = await featureFlagService.getAll();
    res.json(flags);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const flag = await featureFlagService.create(req.body);
    await auditLogService.logFromReq(req, "CREATE", "FeatureFlag", flag.id, { key: flag.key });
    res.status(201).json(flag);
  }),

  update: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const flag = await featureFlagService.update(req.params.id, req.body);
    await auditLogService.logFromReq(req, "UPDATE", "FeatureFlag", flag.id, req.body);
    res.json(flag);
  }),

  toggle: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const flag = await featureFlagService.toggle(req.params.id);
    await auditLogService.logFromReq(req, "TOGGLE", "FeatureFlag", flag.id, { enabled: flag.enabled });
    res.json(flag);
  }),

  remove: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await featureFlagService.remove(req.params.id);
    await auditLogService.logFromReq(req, "DELETE", "FeatureFlag", req.params.id);
    res.json({ message: "Feature flag deleted" });
  }),
};
