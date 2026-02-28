import api from "@/lib/api";
import { Member, PaginatedResponse } from "@/domain/entities/types";

export async function getMembers(page = 1, limit = 10): Promise<PaginatedResponse<Member>> {
  const { data } = await api.get("/members", { params: { page, limit } });
  return data;
}

export async function getMemberById(id: string): Promise<Member> {
  const { data } = await api.get(`/members/${id}`);
  return data;
}

export async function getMyProfile(): Promise<Member> {
  const { data } = await api.get("/members/me");
  return data;
}

export async function updateMyProfile(body: { firstName?: string; lastName?: string; phone?: string }): Promise<Member> {
  const { data } = await api.put("/members/me", body);
  return data;
}
