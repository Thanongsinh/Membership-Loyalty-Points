import { prisma } from "../prisma";
import { CampaignStatus } from "@prisma/client";
import { AppError } from "../../core/utilities/errors";

export const campaignService = {
  async getAll() {
    return prisma.campaign.findMany({ orderBy: { createdAt: "desc" } });
  },

  async getById(id: string) {
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new AppError(404, "Campaign not found");
    return campaign;
  },

  async getActiveCampaigns() {
    const now = new Date();
    return prisma.campaign.findMany({
      where: {
        status: "ACTIVE",
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });
  },

  async getActiveMultiplier(): Promise<number> {
    const campaigns = await this.getActiveCampaigns();
    if (campaigns.length === 0) return 1.0;
    return Math.max(...campaigns.map((c) => c.pointsMultiplier));
  },

  async getActiveBonusPoints(): Promise<number> {
    const campaigns = await this.getActiveCampaigns();
    return campaigns.reduce((sum, c) => sum + c.bonusPoints, 0);
  },

  async create(data: {
    name: string;
    description?: string;
    pointsMultiplier?: number;
    bonusPoints?: number;
    startDate: string;
    endDate: string;
  }) {
    return prisma.campaign.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
  },

  async update(id: string, data: any) {
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    if (data.status) data.status = data.status as CampaignStatus;
    return prisma.campaign.update({ where: { id }, data });
  },

  async updateStatus(id: string, status: CampaignStatus) {
    return prisma.campaign.update({ where: { id }, data: { status } });
  },

  async remove(id: string) {
    return prisma.campaign.delete({ where: { id } });
  },
};
