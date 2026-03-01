import api from "../lib/api";

export interface BadgeDefinition {
  key: string;
  name: string;
  description: string;
  icon: string;
  earned?: boolean;
}

export interface CheckInResult {
  streak: number;
  points: number;
  bonusPoints: number;
  earnedBadges: string[];
}

export async function checkIn(): Promise<CheckInResult> {
  const { data } = await api.post("/gamification/check-in");
  return data;
}

export async function getBadges(): Promise<BadgeDefinition[]> {
  const { data } = await api.get("/gamification/badges");
  return data;
}
