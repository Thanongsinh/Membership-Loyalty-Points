import { create } from "zustand";
import { Product } from "@/domain/entities/types";

interface ComparisonStore {
  products: Product[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useComparisonStore = create<ComparisonStore>((set) => ({
  products: [],
  add: (product) => set((state) => {
    if (state.products.length >= 3) return state;
    if (state.products.find((p) => p.id === product.id)) return state;
    return { products: [...state.products, product] };
  }),
  remove: (id) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
  clear: () => set({ products: [] }),
}));
