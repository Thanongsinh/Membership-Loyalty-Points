import api from "@/lib/api";

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "ENDED";
  pointsMultiplier: number;
  bonusPoints: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export async function getCampaigns(): Promise<Campaign[]> {
  const { data } = await api.get<Campaign[]>("/campaigns");
  return data;
}

export async function getActiveCampaigns(): Promise<Campaign[]> {
  const { data } = await api.get<Campaign[]>("/campaigns/active");
  return data;
}

export async function createCampaign(body: Omit<Campaign, "id" | "createdAt" | "status">) {
  const { data } = await api.post<Campaign>("/campaigns", body);
  return data;
}

export async function updateCampaign(id: string, body: Partial<Campaign>) {
  const { data } = await api.put<Campaign>(`/campaigns/${id}`, body);
  return data;
}

export async function updateCampaignStatus(id: string, status: Campaign["status"]) {
  const { data } = await api.patch<Campaign>(`/campaigns/${id}/status`, { status });
  return data;
}

export async function deleteCampaign(id: string) {
  await api.delete(`/campaigns/${id}`);
}
