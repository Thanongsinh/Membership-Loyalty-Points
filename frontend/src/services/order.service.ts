import api from "@/lib/api";
import { Order, PaginatedResponse } from "@/domain/entities/types";

export async function checkout(): Promise<Order> {
  const { data } = await api.post("/orders/checkout");
  return data;
}

export async function createCashOrder(body: { storeId: string; memberId: string; items: Array<{ productId: string; quantity: number }>; paymentMethod: string }): Promise<Order> {
  const { data } = await api.post("/orders/cash", body);
  return data;
}

export async function getMyOrders(page = 1, limit = 10): Promise<PaginatedResponse<Order>> {
  const { data } = await api.get("/orders/me", { params: { page, limit } });
  return data;
}

export async function getOrders(page = 1, limit = 10, storeId?: string, status?: string): Promise<PaginatedResponse<Order>> {
  const { data } = await api.get("/orders", { params: { page, limit, storeId, status } });
  return data;
}

export async function getOrderById(id: string): Promise<Order> {
  const { data } = await api.get(`/orders/${id}`);
  return data;
}

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return data;
}
