import api from "../lib/api";

export async function getMyReferralCode(): Promise<string> {
  const { data } = await api.get<{ referralCode: string }>("/referrals/my-code");
  return data.referralCode;
}

export async function applyReferral(referralCode: string) {
  const { data } = await api.post("/referrals/apply", { referralCode });
  return data;
}

export async function getMyReferrals() {
  const { data } = await api.get("/referrals/my-referrals");
  return data;
}
