"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyCart, updateCartItem, removeCartItem, clearCart } from "@/services/cart.service";
import { checkout } from "@/services/order.service";
import { applyPromoCode } from "@/services/promotion.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, Tag } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CartPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const router = useRouter();
  const [orderResult, setOrderResult] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState<{ discount: number; bonusPoints: number; name: string } | null>(null);
  const [promoError, setPromoError] = useState("");

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
      toast.success("Order placed successfully!");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Checkout failed"),
  });

  const totalPoints = cart?.reduce((sum, item) => sum + (item.product?.pointsPrice ?? 0) * item.quantity, 0) ?? 0;

  const handleApplyPromo = async () => {
    setPromoError("");
    setPromoResult(null);
    try {
      const result = await applyPromoCode(promoCode, totalPoints);
      setPromoResult({ discount: result.discount, bonusPoints: result.bonusPoints, name: result.promotion.name });
      toast.success("Promo code applied!");
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || "Invalid code";
      setPromoError(errorMsg);
      toast.error(errorMsg);
    }
  };

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
            <CardHeader><CardTitle><Tag className="h-4 w-4 inline mr-1" />{t("promo.code")}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder={t("promo.enterCode")} value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} className="max-w-xs" />
                <Button variant="outline" onClick={handleApplyPromo} disabled={!promoCode}>{t("promo.apply")}</Button>
              </div>
              {promoError && <p className="text-sm text-destructive mt-1">{promoError}</p>}
              {promoResult && (
                <div className="mt-2">
                  <Badge variant="secondary">{promoResult.name}</Badge>
                  {promoResult.discount > 0 && <span className="ml-2 text-green-600 text-sm">-{promoResult.discount.toLocaleString()} {t("receipt.discount")}</span>}
                  {promoResult.bonusPoints > 0 && <span className="ml-2 text-blue-600 text-sm">+{promoResult.bonusPoints} bonus pts</span>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{t("cart.summary")}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between"><span>{t("store.total")}</span><span>{totalPoints.toLocaleString()} {t("store.pts")}</span></div>
              {promoResult && promoResult.discount > 0 && (
                <div className="flex justify-between text-green-600"><span>{t("receipt.discount")}</span><span>-{promoResult.discount.toLocaleString()}</span></div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>{t("store.total")}</span>
                <span>{(totalPoints - (promoResult?.discount || 0)).toLocaleString()} {t("store.pts")}</span>
              </div>
              <Button size="lg" className="w-full" onClick={() => checkoutMut.mutate()} disabled={checkoutMut.isPending}>
                {t("cart.checkout")}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
