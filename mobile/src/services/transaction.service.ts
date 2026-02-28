import api from "../lib/api";
import { Transaction, PaginatedResponse } from "../domain/entities/types";

export async function getMyTransactions(page = 1, limit = 20): Promise<PaginatedResponse<Transaction>> {
  const { data } = await api.get("/transactions/me", { params: { page, limit } });
  return data;
}
