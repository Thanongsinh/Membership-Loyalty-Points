import api from "@/lib/api";
import { ProductCategory } from "@/domain/entities/types";

export async function getCategories(): Promise<ProductCategory[]> {
  const { data } = await api.get("/product-categories");
  return data;
}

export async function createCategory(body: Partial<ProductCategory>): Promise<ProductCategory> {
  const { data } = await api.post("/product-categories", body);
  return data;
}

export async function updateCategory(id: string, body: Partial<ProductCategory>): Promise<ProductCategory> {
  const { data } = await api.put(`/product-categories/${id}`, body);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/product-categories/${id}`);
}
