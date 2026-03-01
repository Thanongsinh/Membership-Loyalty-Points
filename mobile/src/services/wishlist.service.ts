import api from "../lib/api";
import { WishlistItem } from "../domain/entities/types";

export async function getMyWishlist(): Promise<WishlistItem[]> {
  const { data } = await api.get("/wishlist");
  return data;
}

export async function toggleWishlist(productId: string): Promise<{ added: boolean }> {
  const { data } = await api.post(`/wishlist/${productId}`);
  return data;
}
