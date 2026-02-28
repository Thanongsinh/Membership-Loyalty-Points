import api from "../lib/api";
import { Member } from "../domain/entities/types";

export async function getMyProfile(): Promise<Member> {
  const { data } = await api.get("/members/me");
  return data;
}

export async function updateMyProfile(body: { firstName?: string; lastName?: string; phone?: string }): Promise<Member> {
  const { data } = await api.put("/members/me", body);
  return data;
}
