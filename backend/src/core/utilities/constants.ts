import { Tier } from "@prisma/client";

export const TIER_THRESHOLDS: Record<Tier, number> = {
  BRONZE: 0,
  SILVER: 1000,
  GOLD: 5000,
  PLATINUM: 20000,
};

export function calculateTier(totalPoints: number): Tier {
  if (totalPoints >= TIER_THRESHOLDS.PLATINUM) return "PLATINUM";
  if (totalPoints >= TIER_THRESHOLDS.GOLD) return "GOLD";
  if (totalPoints >= TIER_THRESHOLDS.SILVER) return "SILVER";
  return "BRONZE";
}
