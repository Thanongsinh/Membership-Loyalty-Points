import { promotionRepository } from "../repositories/promotion.repository";
import { AppError } from "../../core/utilities/errors";
import { PaginationParams, paginatedResponse } from "../../core/utilities/pagination";

export const promotionService = {
  async getAll(params: PaginationParams, activeOnly = false) {
    const [data, total] = await Promise.all([
      promotionRepository.findAll(params.skip, params.limit, activeOnly),
      promotionRepository.count(activeOnly),
    ]);
    return paginatedResponse(data, total, params);
  },

  async getById(id: string) {
    const promo = await promotionRepository.findById(id);
    if (!promo) throw new AppError(404, "Promotion not found");
    return promo;
  },

  async create(data: any) {
    return promotionRepository.create(data);
  },

  async update(id: string, data: any) {
    return promotionRepository.update(id, data);
  },

  async delete(id: string) {
    return promotionRepository.delete(id);
  },

  async applyCode(code: string, memberId: string, subtotal: number, storeId?: string) {
    const promo = await promotionRepository.findByCode(code.toUpperCase());
    if (!promo) throw new AppError(404, "Promotion code not found");
    if (!promo.isActive) throw new AppError(400, "Promotion is not active");

    const now = new Date();
    if (now < promo.startDate || now > promo.endDate) throw new AppError(400, "Promotion has expired");
    if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) throw new AppError(400, "Promotion usage limit reached");
    if (promo.minOrderAmount && subtotal < promo.minOrderAmount) throw new AppError(400, `Minimum order amount is ${promo.minOrderAmount}`);
    if (promo.storeId && storeId && promo.storeId !== storeId) throw new AppError(400, "Promotion not valid for this store");

    // Check if member already used this promotion
    const used = await promotionRepository.findUsage(promo.id, memberId);
    if (used) throw new AppError(400, "You have already used this promotion");

    let discount = 0;
    switch (promo.type) {
      case "PERCENTAGE":
        discount = subtotal * (promo.value / 100);
        break;
      case "FIXED":
        discount = Math.min(promo.value, subtotal);
        break;
      case "BONUS_POINTS":
        discount = 0; // Points bonus handled separately
        break;
    }

    return { promotion: promo, discount, bonusPoints: promo.type === "BONUS_POINTS" ? promo.value : 0 };
  },
};
