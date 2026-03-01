import api from "@/lib/api";
import { ProductReview } from "@/domain/entities/types";

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  const { data } = await api.get(`/reviews/product/${productId}`);
  return data;
}

export async function createReview(body: { productId: string; orderId: string; rating: number; comment?: string }): Promise<ProductReview> {
  const { data } = await api.post("/reviews", body);
  return data;
}
