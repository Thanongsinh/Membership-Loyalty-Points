import api from "@/lib/api";

export interface PointsHistoryItem {
  date: string;
  earned: number;
  spent: number;
}

export async function getPointsHistory(days = 30): Promise<PointsHistoryItem[]> {
  const { data } = await api.get("/transactions/my-history", { params: { days } });
  return data;
}
