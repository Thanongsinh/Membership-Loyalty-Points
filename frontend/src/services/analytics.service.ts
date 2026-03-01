import api from "@/lib/api";

export interface DashboardAnalytics {
  totalMembers: number;
  totalTransactions: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  tierCounts: { BRONZE: number; SILVER: number; GOLD: number; PLATINUM: number };
  dailyChart: { date: string; earned: number; redeemed: number }[];
}

export async function getDashboardAnalytics(from?: string, to?: string): Promise<DashboardAnalytics> {
  const { data } = await api.get("/analytics/dashboard", { params: { from, to } });
  return data;
}

export async function exportCsv(type: "transactions" | "members", from?: string, to?: string) {
  const { data } = await api.get("/analytics/export/csv", {
    params: { type, from, to },
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
