import api from "@/lib/api";
import { Store, PaginatedResponse } from "@/domain/entities/types";

export async function getStores(page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Store>> {
  const { data } = await api.get("/stores", { params: { page, limit, search } });
  return data;
}

export async function getStoreById(id: string): Promise<Store> {
  const { data } = await api.get(`/stores/${id}`);
  return data;
}

export async function createStore(body: Partial<Store>): Promise<Store> {
  const { data } = await api.post("/stores", body);
  return data;
}

export async function updateStore(id: string, body: Partial<Store>): Promise<Store> {
  const { data } = await api.put(`/stores/${id}`, body);
  return data;
}

export async function deleteStore(id: string): Promise<void> {
  await api.delete(`/stores/${id}`);
}

export async function assignStaff(storeId: string, userId: string, isManager = false) {
  const { data } = await api.post(`/stores/${storeId}/staff`, { userId, isManager });
  return data;
}

export async function removeStaff(storeId: string, userId: string) {
  await api.delete(`/stores/${storeId}/staff/${userId}`);
}
