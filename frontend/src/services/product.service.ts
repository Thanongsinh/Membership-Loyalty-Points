import api from "@/lib/api";
import { Product, PaginatedResponse } from "@/domain/entities/types";

export async function getProducts(page = 1, limit = 10, filters?: { storeId?: string; categoryId?: string; search?: string }): Promise<PaginatedResponse<Product>> {
  const { data } = await api.get("/products", { params: { page, limit, ...filters } });
  return data;
}

export async function getProductById(id: string): Promise<Product> {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function createProduct(body: Partial<Product>): Promise<Product> {
  const { data } = await api.post("/products", body);
  return data;
}

export async function updateProduct(id: string, body: Partial<Product>): Promise<Product> {
  const { data } = await api.put(`/products/${id}`, body);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
