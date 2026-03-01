import api from "@/lib/api";
import { Promotion } from "@/domain/entities/types";

export async function getFlashSales(): Promise<(Promotion & { isFlashSale: boolean; flashSaleStock: number | null })[]> {
  const { data } = await api.get("/promotions/flash-sales");
  return data;
}
