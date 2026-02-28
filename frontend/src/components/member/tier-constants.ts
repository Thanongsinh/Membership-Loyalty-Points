import { Tier } from "@/domain/entities/types";

export const TIER_THRESHOLDS: Record<Tier, number> = {
  BRONZE: 0,
  SILVER: 1000,
  GOLD: 5000,
  PLATINUM: 20000,
};

export const TIER_COLORS: Record<Tier, string> = {
  BRONZE: "#CD7F32",
  SILVER: "#C0C0C0",
  GOLD: "#FFD700",
  PLATINUM: "#E5E4E2",
};
