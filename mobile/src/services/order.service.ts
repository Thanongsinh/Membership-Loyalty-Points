import api from "../lib/api";
import { Order, PaginatedResponse } from "../domain/entities/types";

export async function getMyOrders(page = 1, limit = 20): Promise<PaginatedResponse<Order>> {
  const { data } = await api.get("/orders/me", { params: { page, limit } });
  return data;
}
