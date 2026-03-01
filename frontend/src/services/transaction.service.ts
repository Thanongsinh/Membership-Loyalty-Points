import api from "@/lib/api";
import { Transaction, PaginatedResponse } from "@/domain/entities/types";

export async function getTransactions(page = 1, limit = 10, type?: string, search?: string): Promise<PaginatedResponse<Transaction>> {
  const { data } = await api.get("/transactions", { params: { page, limit, type, search } });
  return data;
}

export async function getMyTransactions(page = 1, limit = 10): Promise<PaginatedResponse<Transaction>> {
  const { data } = await api.get("/transactions/me", { params: { page, limit } });
  return data;
}
