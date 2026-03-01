import api from "../lib/api";
import { CartItem, Order } from "../domain/entities/types";

export async function getMyCart(): Promise<CartItem[]> {
  const { data } = await api.get("/cart");
  return data;
}

export async function addToCart(productId: string, quantity = 1) {
  const { data } = await api.post("/cart", { productId, quantity });
  return data;
}

export async function removeCartItem(productId: string) {
  await api.delete(`/cart/${productId}`);
}

export async function checkout(): Promise<Order> {
  const { data } = await api.post("/orders/checkout");
  return data;
}
