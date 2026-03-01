import api from "@/lib/api";

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  type: string;
  label: string;
  description: string | null;
  group: string;
}

export async function getSystemSettings(): Promise<SystemSetting[]> {
  const { data } = await api.get<SystemSetting[]>("/settings");
  return data;
}

export async function updateSettingValue(id: string, value: string) {
  const { data } = await api.patch<SystemSetting>(`/settings/${id}`, { value });
  return data;
}

export async function upsertSetting(body: { key: string; value: string; type?: string; label: string; description?: string; group?: string }) {
  const { data } = await api.post<SystemSetting>("/settings", body);
  return data;
}

export async function deleteSetting(id: string) {
  await api.delete(`/settings/${id}`);
}
