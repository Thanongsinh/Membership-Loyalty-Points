import { Request, Response } from "express";
import { asyncHandler } from "../../core/utilities/errors";
import { campaignService } from "../../data/services/campaign.service";
import { auditLogService } from "../../data/services/audit-log.service";
import { CampaignStatus } from "@prisma/client";

export const campaignController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const campaigns = await campaignService.getAll();
    res.json(campaigns);
  }),

  getById: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const campaign = await campaignService.getById(req.params.id);
    res.json(campaign);
  }),

  getActive: asyncHandler(async (_req: Request, res: Response) => {
    const campaigns = await campaignService.getActiveCampaigns();
    res.json(campaigns);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const campaign = await campaignService.create(req.body);
    await auditLogService.logFromReq(req, "CREATE", "Campaign", campaign.id, { name: campaign.name });
    res.status(201).json(campaign);
  }),

  update: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const campaign = await campaignService.update(req.params.id, req.body);
    await auditLogService.logFromReq(req, "UPDATE", "Campaign", campaign.id, req.body);
    res.json(campaign);
  }),

  updateStatus: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const campaign = await campaignService.updateStatus(req.params.id, req.body.status as CampaignStatus);
    await auditLogService.logFromReq(req, "STATUS_CHANGE", "Campaign", campaign.id, { status: campaign.status });
    res.json(campaign);
  }),

  remove: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await campaignService.remove(req.params.id);
    await auditLogService.logFromReq(req, "DELETE", "Campaign", req.params.id);
    res.json({ message: "Campaign deleted" });
  }),
};
