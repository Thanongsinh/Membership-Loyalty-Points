import api from "@/lib/api";
import { Member } from "@/domain/entities/types";

export async function earnPoints(memberId: string, points: number, description?: string): Promise<Member> {
  const { data } = await api.post("/points/earn", { memberId, points, description });
  return data;
}

export async function adjustPoints(memberId: string, points: number, description?: string): Promise<Member> {
  const { data } = await api.post("/points/adjust", { memberId, points, description });
  return data;
}
