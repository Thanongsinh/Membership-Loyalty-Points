import { Request, Response } from "express";
import { asyncHandler } from "../../core/utilities/errors";
import { auditLogService } from "../../data/services/audit-log.service";

export const auditLogController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const result = await auditLogService.getAll(req);
    res.json(result);
  }),
};
