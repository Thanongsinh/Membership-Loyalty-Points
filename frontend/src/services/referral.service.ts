import api from "@/lib/api";

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  status: "PENDING" | "COMPLETED" | "EXPIRED";
  referrerBonus: number;
  referredBonus: number;
  completedAt: string | null;
  createdAt: string;
  referred?: { firstName: string; lastName: string; createdAt: string };
  referrer?: { firstName: string; lastName: string };
}

export async function getMyReferralCode(): Promise<string> {
  const { data } = await api.get<{ referralCode: string }>("/referrals/my-code");
  return data.referralCode;
}

export async function applyReferral(referralCode: string): Promise<Referral> {
  const { data } = await api.post<Referral>("/referrals/apply", { referralCode });
  return data;
}

export async function getMyReferrals(): Promise<Referral[]> {
  const { data } = await api.get<Referral[]>("/referrals/my-referrals");
  return data;
}

export async function getAllReferrals(): Promise<Referral[]> {
  const { data } = await api.get<Referral[]>("/referrals");
  return data;
}
