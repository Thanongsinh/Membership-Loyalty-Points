"use client";
import { useComparisonStore } from "@/stores/comparison.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/page-transition";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const { products, clear } = useComparisonStore();

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No products to compare. Add products from a store page.</p>
        <Link href="/portal/stores"><Button>Browse Stores</Button></Link>
      </div>
    );
  }

  const fields = [
    { label: "Price", render: (p: any) => `${p.price.toLocaleString()} THB` },
    { label: "Points Price", render: (p: any) => p.pointsPrice ? `${p.pointsPrice.toLocaleString()} pts` : "-" },
    { label: "Stock", render: (p: any) => p.stock.toString() },
    { label: "Category", render: (p: any) => p.category?.name || "-" },
    { label: "Rating", render: (p: any) => p.averageRating ? `${p.averageRating.toFixed(1)} ★` : "No ratings" },
    { label: "Store", render: (p: any) => p.store?.name || "-" },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/portal/stores"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <h2 className="text-2xl font-bold">Compare Products</h2>
          </div>
          <Button variant="outline" size="sm" onClick={clear}>Clear All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 border-b font-medium text-muted-foreground">Feature</th>
                {products.map((p) => (
                  <th key={p.id} className="p-3 border-b text-center">
                    <div className="font-semibold">{p.name}</div>
                    {p.description && <div className="text-xs text-muted-foreground mt-1">{p.description}</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.label} className="border-b">
                  <td className="p-3 font-medium text-sm text-muted-foreground">{field.label}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 text-center text-sm">{field.render(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
}
