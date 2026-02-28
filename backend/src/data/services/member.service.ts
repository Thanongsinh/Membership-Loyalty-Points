import { memberRepository } from "../repositories/member.repository";
import { calculateTier } from "../../core/utilities/constants";
import { AppError } from "../../core/utilities/errors";
import { PaginationParams, paginatedResponse } from "../../core/utilities/pagination";

export const memberService = {
  async getAll(params: PaginationParams) {
    const [data, total] = await Promise.all([
      memberRepository.findAll(params.skip, params.limit),
      memberRepository.count(),
    ]);
    return paginatedResponse(data, total, params);
  },

  async getById(id: string) {
    const member = await memberRepository.findById(id);
    if (!member) throw new AppError(404, "Member not found");
    return member;
  },

  async getProfile(userId: string) {
    const member = await memberRepository.findByUserId(userId);
    if (!member) throw new AppError(404, "Member profile not found");
    return member;
  },

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string }) {
    const member = await memberRepository.findByUserId(userId);
    if (!member) throw new AppError(404, "Member profile not found");
    return memberRepository.update(member.id, data);
  },

  async recalculateTier(memberId: string) {
    const member = await memberRepository.findById(memberId);
    if (!member) return;
    const newTier = calculateTier(member.totalPoints);
    if (newTier !== member.tier) {
      await memberRepository.update(memberId, { tier: newTier });
    }
  },
};
