"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStoreById } from "@/services/store.service";
import { getProducts } from "@/services/product.service";
import { getCategories } from "@/services/product-category.service";
import { addToCart } from "@/services/cart.service";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function StorefrontPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const qc = useQueryClient();
  const [catFilter, setCatFilter] = useState("");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const { data: store } = useQuery({ queryKey: ["store", id], queryFn: () => getStoreById(id) });
  const { data: products } = useQuery({ queryKey: ["products", id, catFilter], queryFn: () => getProducts(1, 100, { storeId: id, categoryId: catFilter || undefined }) });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });

  const addMut = useMutation({
    mutationFn: (productId: string) => addToCart(productId),
    onSuccess: (_, productId) => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      setAddedIds((prev) => new Set(prev).add(productId));
      setTimeout(() => setAddedIds((prev) => { const n = new Set(prev); n.delete(productId); return n; }), 2000);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{store?.name}</h2>
        {store?.description && <p className="text-muted-foreground">{store.description}</p>}
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant={catFilter === "" ? "default" : "outline"} size="sm" onClick={() => setCatFilter("")}>{t("order.allStatuses")}</Button>
        {categories?.map((c) => (
          <Button key={c.id} variant={catFilter === c.id ? "default" : "outline"} size="sm" onClick={() => setCatFilter(c.id)}>{c.name}</Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products?.data.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="text-base">{p.name}</CardTitle>
              {p.category && <Badge variant="outline">{p.category.name}</Badge>}
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {p.description && <p className="text-muted-foreground">{p.description}</p>}
              <p className="font-semibold">{p.price.toLocaleString()} {t("store.currency")}</p>
              {p.pointsPrice && <p className="text-primary">{p.pointsPrice.toLocaleString()} {t("store.pts")}</p>}
              <p className="text-xs text-muted-foreground">{t("store.stock")}: {p.stock}</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" disabled={p.stock <= 0 || addMut.isPending} onClick={() => addMut.mutate(p.id)} className="w-full">
                {addedIds.has(p.id) ? <><Check className="h-4 w-4 mr-1" />{t("store.added")}</> : <><ShoppingCart className="h-4 w-4 mr-1" />{t("store.addToCart")}</>}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
