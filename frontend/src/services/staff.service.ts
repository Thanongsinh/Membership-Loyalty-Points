import api from "@/lib/api";
import { StaffDashboard, PaginatedResponse, Order } from "@/domain/entities/types";

export async function getStaffDashboard(): Promise<StaffDashboard> {
  const { data } = await api.get("/staff/dashboard");
  return data;
}

export async function getStaffOrders(page = 1, limit = 20, status?: string): Promise<PaginatedResponse<Order>> {
  const { data } = await api.get("/staff/orders", { params: { page, limit, status } });
  return data;
}

export async function updateStaffOrderStatus(id: string, status: string): Promise<Order> {
  const { data } = await api.patch(`/staff/orders/${id}/status`, { status });
  return data;
}

export async function staffEarnPoints(body: { memberId: string; items: Array<{ productId: string; quantity: number }>; storeId?: string }): Promise<Order> {
  const { data } = await api.post("/staff/earn-points", { ...body, paymentMethod: "CASH" });
  return data;
}
