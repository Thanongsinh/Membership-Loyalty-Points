import api from "@/lib/api";
import { Receipt } from "@/domain/entities/types";

export async function getReceipt(orderId: string): Promise<Receipt> {
  const { data } = await api.get(`/orders/${orderId}/receipt`);
  return data;
}
