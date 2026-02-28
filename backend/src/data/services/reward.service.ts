import { prisma } from "../prisma";
import { rewardRepository } from "../repositories/reward.repository";
import { AppError } from "../../core/utilities/errors";
import { PaginationParams, paginatedResponse } from "../../core/utilities/pagination";
import { memberService } from "./member.service";

export const rewardService = {
  async getAll(params: PaginationParams, activeOnly = false) {
    const [data, total] = await Promise.all([
      rewardRepository.findAll(params.skip, params.limit, activeOnly),
      rewardRepository.count(activeOnly),
    ]);
    return paginatedResponse(data, total, params);
  },

  async getById(id: string) {
    const reward = await rewardRepository.findById(id);
    if (!reward) throw new AppError(404, "Reward not found");
    return reward;
  },

  async create(data: { name: string; description?: string; pointsCost: number; stock: number; imageUrl?: string }) {
    return rewardRepository.create(data);
  },

  async update(id: string, data: { name?: string; description?: string; pointsCost?: number; stock?: number; imageUrl?: string; isActive?: boolean }) {
    await this.getById(id);
    return rewardRepository.update(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    return rewardRepository.delete(id);
  },

  async redeem(memberId: string, rewardId: string) {
    const reward = await this.getById(rewardId);
    if (!reward.isActive) throw new AppError(400, "Reward is not available");
    if (reward.stock <= 0) throw new AppError(400, "Reward out of stock");

    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new AppError(404, "Member not found");
    if (member.currentPoints < reward.pointsCost) throw new AppError(400, "Insufficient points");

    const [redemption] = await prisma.$transaction([
      prisma.redemption.create({
        data: { memberId, rewardId, pointsUsed: reward.pointsCost },
      }),
      prisma.transaction.create({
        data: { memberId, type: "REDEEM", points: -reward.pointsCost, description: `Redeemed: ${reward.name}` },
      }),
      prisma.member.update({
        where: { id: memberId },
        data: { currentPoints: { decrement: reward.pointsCost } },
      }),
      prisma.reward.update({
        where: { id: rewardId },
        data: { stock: { decrement: 1 } },
      }),
    ]);

    return redemption;
  },
};
