import { Request, Response } from "express";
import { asyncHandler } from "../../core/utilities/errors";
import { systemSettingService } from "../../data/services/system-setting.service";
import { auditLogService } from "../../data/services/audit-log.service";

export const systemSettingController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const settings = await systemSettingService.getAll();
    res.json(settings);
  }),

  getByGroup: asyncHandler(async (req: Request<{ group: string }>, res: Response) => {
    const settings = await systemSettingService.getByGroup(req.params.group);
    res.json(settings);
  }),

  upsert: asyncHandler(async (req: Request, res: Response) => {
    const setting = await systemSettingService.upsert(req.body);
    await auditLogService.logFromReq(req, "UPSERT", "SystemSetting", setting.id, { key: setting.key, value: setting.value });
    res.json(setting);
  }),

  updateValue: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const setting = await systemSettingService.updateValue(req.params.id, req.body.value);
    await auditLogService.logFromReq(req, "UPDATE", "SystemSetting", setting.id, { key: setting.key, value: setting.value });
    res.json(setting);
  }),

  remove: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await systemSettingService.remove(req.params.id);
    await auditLogService.logFromReq(req, "DELETE", "SystemSetting", req.params.id);
    res.json({ message: "Setting deleted" });
  }),
};
