import api from "@/lib/api";

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  createdAt: string;
}

export async function getFeatureFlags(): Promise<FeatureFlag[]> {
  const { data } = await api.get<FeatureFlag[]>("/feature-flags");
  return data;
}

export async function createFeatureFlag(body: { key: string; name: string; description?: string; enabled?: boolean }) {
  const { data } = await api.post<FeatureFlag>("/feature-flags", body);
  return data;
}

export async function updateFeatureFlag(id: string, body: Partial<FeatureFlag>) {
  const { data } = await api.put<FeatureFlag>(`/feature-flags/${id}`, body);
  return data;
}

export async function toggleFeatureFlag(id: string) {
  const { data } = await api.patch<FeatureFlag>(`/feature-flags/${id}/toggle`);
  return data;
}

export async function deleteFeatureFlag(id: string) {
  await api.delete(`/feature-flags/${id}`);
}
