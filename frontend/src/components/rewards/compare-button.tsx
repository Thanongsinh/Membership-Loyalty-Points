"use client";
import { Button } from "@/components/ui/button";
import { GitCompareArrows } from "lucide-react";
import { useComparisonStore } from "@/stores/comparison.store";
import { Product } from "@/domain/entities/types";

export function CompareButton({ product }: { product: Product }) {
  const { products, add, remove } = useComparisonStore();
  const isSelected = products.some((p) => p.id === product.id);

  return (
    <Button
      variant={isSelected ? "secondary" : "ghost"}
      size="icon"
      className="h-8 w-8"
      onClick={() => isSelected ? remove(product.id) : add(product)}
      title="Compare"
    >
      <GitCompareArrows className="h-4 w-4" />
    </Button>
  );
}
