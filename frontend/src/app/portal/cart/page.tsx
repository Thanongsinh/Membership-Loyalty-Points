"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyCart, updateCartItem, removeCartItem, clearCart } from "@/services/cart.service";
import { checkout } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const router = useRouter();
  const [orderResult, setOrderResult] = useState<string | null>(null);

  const { data: cart, isLoading } = useQuery({ queryKey: ["cart"], queryFn: getMyCart });

  const updateMut = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => updateCartItem(productId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMut = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const clearMut = useMutation({
    mutationFn: clearCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const checkoutMut = useMutation({
    mutationFn: checkout,
    onSuccess: (order) => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      setOrderResult(order.orderNumber);
    },
  });

  const totalPoints = cart?.reduce((sum, item) => sum + (item.product?.pointsPrice ?? 0) * item.quantity, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("cart.title")}</h2>
        {cart && cart.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => clearMut.mutate()}>{t("cart.clear")}</Button>
        )}
      </div>

      {orderResult && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-4">
            <p className="text-green-700 dark:text-green-300 font-medium">{t("cart.orderSuccess")} #{orderResult}</p>
            <Button variant="link" onClick={() => router.push("/portal/orders")}>{t("cart.viewOrders")}</Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? <p>{t("loading")}</p> : !cart || cart.length === 0 ? (
        <p className="text-muted-foreground">{t("cart.empty")}</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("store.productName")}</TableHead>
                <TableHead>{t("order.store")}</TableHead>
                <TableHead>{t("store.pointsPrice")}</TableHead>
                <TableHead>{t("cart.quantity")}</TableHead>
                <TableHead>{t("store.total")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product?.name}</TableCell>
                  <TableCell>{item.product?.store?.name}</TableCell>
                  <TableCell>{item.product?.pointsPrice?.toLocaleString() ?? "-"} {t("store.pts")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateMut.mutate({ productId: item.productId, quantity: item.quantity - 1 })} disabled={item.quantity <= 1}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateMut.mutate({ productId: item.productId, quantity: item.quantity + 1 })}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{((item.product?.pointsPrice ?? 0) * item.quantity).toLocaleString()} {t("store.pts")}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeMut.mutate(item.productId)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Card>
            <CardHeader><CardTitle>{t("cart.summary")}</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-lg font-bold">{t("store.total")}: {totalPoints.toLocaleString()} {t("store.pts")}</p>
              <Button size="lg" onClick={() => checkoutMut.mutate()} disabled={checkoutMut.isPending}>
                {t("cart.checkout")}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
