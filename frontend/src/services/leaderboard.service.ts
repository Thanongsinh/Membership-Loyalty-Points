import api from "@/lib/api";

export interface LeaderboardEntry {
  id: string;
  firstName: string;
  lastName: string;
  totalPoints: number;
  tier: string;
  avatarUrl?: string;
}

export async function getPointsLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const { data } = await api.get("/leaderboard/points", { params: { limit } });
  return data;
}
