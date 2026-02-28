import api from "../lib/api";
import { Reward, PaginatedResponse } from "../domain/entities/types";

export async function getRewards(page = 1, limit = 20): Promise<PaginatedResponse<Reward>> {
  const { data } = await api.get("/rewards", { params: { page, limit } });
  return data;
}

export async function redeemReward(id: string): Promise<void> {
  await api.post(`/rewards/${id}/redeem`);
}
