import api from "../lib/api";
import { Store, Product, PaginatedResponse } from "../domain/entities/types";

export async function getStores(page = 1, limit = 20): Promise<PaginatedResponse<Store>> {
  const { data } = await api.get("/stores", { params: { page, limit } });
  return data;
}

export async function getStoreById(id: string): Promise<Store> {
  const { data } = await api.get(`/stores/${id}`);
  return data;
}

export async function getProducts(storeId: string, page = 1, limit = 50): Promise<PaginatedResponse<Product>> {
  const { data } = await api.get("/products", { params: { page, limit, storeId } });
  return data;
}
