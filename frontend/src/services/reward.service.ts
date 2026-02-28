import api from "@/lib/api";
import { Reward, PaginatedResponse } from "@/domain/entities/types";

export async function getRewards(page = 1, limit = 10): Promise<PaginatedResponse<Reward>> {
  const { data } = await api.get("/rewards", { params: { page, limit } });
  return data;
}

export async function createReward(body: { name: string; description?: string; pointsCost: number; stock: number; imageUrl?: string }): Promise<Reward> {
  const { data } = await api.post("/rewards", body);
  return data;
}

export async function updateReward(id: string, body: Partial<Reward>): Promise<Reward> {
  const { data } = await api.put(`/rewards/${id}`, body);
  return data;
}

export async function deleteReward(id: string): Promise<void> {
  await api.delete(`/rewards/${id}`);
}

export async function redeemReward(id: string): Promise<void> {
  await api.post(`/rewards/${id}/redeem`);
}
