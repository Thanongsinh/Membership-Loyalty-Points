"use client";
import { useComparisonStore } from "@/stores/comparison.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, GitCompareArrows } from "lucide-react";
import Link from "next/link";

export function ComparisonBar() {
  const { products, remove, clear } = useComparisonStore();
  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border shadow-lg rounded-lg p-3 flex items-center gap-3">
      <GitCompareArrows className="h-5 w-5 text-primary" />
      <div className="flex gap-2">
        {products.map((p) => (
          <Badge key={p.id} variant="secondary" className="flex items-center gap-1">
            {p.name}
            <button onClick={() => remove(p.id)}><X className="h-3 w-3" /></button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Link href="/portal/compare"><Button size="sm" disabled={products.length < 2}>Compare ({products.length})</Button></Link>
        <Button variant="ghost" size="sm" onClick={clear}>Clear</Button>
      </div>
    </div>
  );
}
