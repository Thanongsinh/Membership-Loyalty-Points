"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStoreById } from "@/services/store.service";
import { getProducts } from "@/services/product.service";
import { getCategories } from "@/services/product-category.service";
import { addToCart } from "@/services/cart.service";
import { toggleWishlist } from "@/services/wishlist.service";
import { getProductReviews } from "@/services/review.service";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, Check, Heart, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Product } from "@/domain/entities/types";

export default function StorefrontPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const qc = useQueryClient();
  const [catFilter, setCatFilter] = useState("");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [reviewProductId, setReviewProductId] = useState<string | null>(null);

  const { data: store } = useQuery({ queryKey: ["store", id], queryFn: () => getStoreById(id) });
  const { data: products } = useQuery({ queryKey: ["products", id, catFilter], queryFn: () => getProducts(1, 100, { storeId: id, categoryId: catFilter || undefined }) });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: reviews } = useQuery({ queryKey: ["reviews", reviewProductId], queryFn: () => getProductReviews(reviewProductId!), enabled: !!reviewProductId });

  const addMut = useMutation({
    mutationFn: (productId: string) => addToCart(productId),
    onSuccess: (_, productId) => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      setAddedIds((prev) => new Set(prev).add(productId));
      setTimeout(() => setAddedIds((prev) => { const n = new Set(prev); n.delete(productId); return n; }), 2000);
    },
  });

  const wishMut = useMutation({
    mutationFn: (productId: string) => toggleWishlist(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const renderStars = (rating: number) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-3 w-3 ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
  );

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

      <Dialog open={!!reviewProductId} onOpenChange={() => setReviewProductId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("review.reviews")}</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {reviews && reviews.length > 0 ? reviews.map((r) => (
              <div key={r.id} className="border-b pb-2">
                <div className="flex items-center gap-2">{renderStars(r.rating)}<span className="text-xs text-muted-foreground">{r.member?.firstName}</span></div>
                {r.comment && <p className="text-sm mt-1">{r.comment}</p>}
              </div>
            )) : <p className="text-sm text-muted-foreground">{t("review.noReviews")}</p>}
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products?.data.map((p: Product & { averageRating?: number; reviewCount?: number }) => (
          <Card key={p.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => wishMut.mutate(p.id)}>
                  <Heart className="h-4 w-4 hover:fill-red-500 hover:text-red-500" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {p.category && <Badge variant="outline">{p.category.name}</Badge>}
                {(p as any).averageRating > 0 && (
                  <button onClick={() => setReviewProductId(p.id)} className="flex items-center gap-1 text-xs">
                    {renderStars(Math.round((p as any).averageRating))}
                    <span className="text-muted-foreground">({(p as any).reviewCount})</span>
                  </button>
                )}
              </div>
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
