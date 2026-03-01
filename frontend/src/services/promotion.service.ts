import api from "@/lib/api";
import { Promotion, PromotionApplyResult, PaginatedResponse } from "@/domain/entities/types";

export async function getPromotions(page = 1, limit = 20): Promise<PaginatedResponse<Promotion>> {
  const { data } = await api.get("/promotions", { params: { page, limit } });
  return data;
}

export async function getPromotionById(id: string): Promise<Promotion> {
  const { data } = await api.get(`/promotions/${id}`);
  return data;
}

export async function createPromotion(body: Partial<Promotion>): Promise<Promotion> {
  const { data } = await api.post("/promotions", body);
  return data;
}

export async function updatePromotion(id: string, body: Partial<Promotion>): Promise<Promotion> {
  const { data } = await api.put(`/promotions/${id}`, body);
  return data;
}

export async function deletePromotion(id: string): Promise<void> {
  await api.delete(`/promotions/${id}`);
}

export async function applyPromoCode(code: string, subtotal: number, storeId?: string): Promise<PromotionApplyResult> {
  const { data } = await api.post("/promotions/apply", { code, subtotal, storeId });
  return data;
}
