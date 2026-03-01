import api from "@/lib/api";

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: any;
  ipAddress: string | null;
  createdAt: string;
}

export async function getAuditLogs(page = 1, limit = 20, filters?: { entity?: string; action?: string }) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (filters?.entity) params.set("entity", filters.entity);
  if (filters?.action) params.set("action", filters.action);
  const { data } = await api.get<{ data: AuditLog[]; meta: any }>(`/audit-logs?${params}`);
  return data;
}
