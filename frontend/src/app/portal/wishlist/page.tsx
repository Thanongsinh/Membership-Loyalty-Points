"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyWishlist, toggleWishlist } from "@/services/wishlist.service";
import { addToCart } from "@/services/cart.service";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SkeletonCardGrid } from "@/components/layout/skeleton-cards";

export default function WishlistPage() {
  const { t } = useI18n();
  const qc = useQueryClient();

  const { data: items, isLoading } = useQuery({ queryKey: ["wishlist"], queryFn: getMyWishlist });

  const removeMut = useMutation({
    mutationFn: (productId: string) => toggleWishlist(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const addCartMut = useMutation({
    mutationFn: (productId: string) => addToCart(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("wishlist.title")}</h2>
      {isLoading ? <SkeletonCardGrid /> : !items || items.length === 0 ? (
        <p className="text-muted-foreground">{t("wishlist.empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  {item.product?.name}
                  <Button variant="ghost" size="icon" onClick={() => removeMut.mutate(item.productId)}>
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>
                </CardTitle>
                {item.product?.store && <Badge variant="outline">{item.product.store.name}</Badge>}
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-semibold">{item.product?.price.toLocaleString()} {t("store.currency")}</p>
                {item.product?.pointsPrice && <p className="text-primary">{item.product.pointsPrice.toLocaleString()} {t("store.pts")}</p>}
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full" onClick={() => addCartMut.mutate(item.productId)} disabled={!item.product || item.product.stock <= 0}>
                  <ShoppingCart className="h-4 w-4 mr-1" />{t("store.addToCart")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
