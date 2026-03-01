"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { getMyOrders } from "@/services/order.service";
import { createReview } from "@/services/review.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, Star, MessageSquare } from "lucide-react";
import { OrderTimeline } from "@/components/member/order-timeline";
import { useI18n } from "@/lib/i18n";
import { useAuthStore } from "@/stores/auth.store";
import { SkeletonTable } from "@/components/layout/skeleton-cards";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "outline", CONFIRMED: "secondary", PREPARING: "secondary", READY: "default", COMPLETED: "default", CANCELLED: "destructive",
};

export default function MyOrdersPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.accessToken);
  const { data, isLoading } = useQuery({ queryKey: ["my-orders"], queryFn: () => getMyOrders(1, 50) });
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ orderId: "", productId: "", productName: "", rating: 5, comment: "" });

  // SSE for real-time order status
  useEffect(() => {
    if (!token) return;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const es = new EventSource(`${baseUrl}/api/sse/orders?token=${token}`);
    es.addEventListener("order-status", () => {
      qc.invalidateQueries({ queryKey: ["my-orders"] });
    });
    return () => es.close();
  }, [token, qc]);

  const reviewMut = useMutation({
    mutationFn: () => createReview({ productId: reviewForm.productId, orderId: reviewForm.orderId, rating: reviewForm.rating, comment: reviewForm.comment || undefined }),
    onSuccess: () => { setReviewOpen(false); setReviewForm({ orderId: "", productId: "", productName: "", rating: 5, comment: "" }); },
  });

  const openReview = useCallback((orderId: string, productId: string, productName: string) => {
    setReviewForm({ orderId, productId, productName, rating: 5, comment: "" });
    setReviewOpen(true);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("order.myOrders")}</h2>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("review.write")} - {reviewForm.productName}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{t("review.rating")}</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                    <Star className={`h-6 w-6 ${n <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div><Label>{t("review.comment")}</Label><Input value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} /></div>
            <Button onClick={() => reviewMut.mutate()} disabled={reviewMut.isPending}>{t("review.submit")}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? <SkeletonTable rows={8} /> : !data || data.data.length === 0 ? (
        <p className="text-muted-foreground">{t("order.noOrders")}</p>
      ) : (
        <div className="space-y-4">
          {data.data.map((o) => (
            <Card key={o.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-mono"><Link href={`/portal/orders/${o.id}`} className="hover:underline">{o.orderNumber}</Link></CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
                    <Link href={`/portal/orders/${o.id}/receipt`}>
                      <Button variant="ghost" size="icon"><Receipt className="h-4 w-4" /></Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              {o.status !== "COMPLETED" && o.status !== "CANCELLED" && (
                <div className="px-6"><OrderTimeline status={o.status} /></div>
              )}
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{o.store?.name}</span>
                  <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{o.paymentMethod}</span>
                  <span className="font-semibold">{o.paymentMethod === "POINTS" ? `${o.pointsUsed} pts` : `${o.totalAmount.toLocaleString()}`}</span>
                </div>
                {o.orderItems && o.orderItems.length > 0 && (
                  <div className="pt-2 border-t space-y-1">
                    {o.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs items-center">
                        <span>{item.productName} x{item.quantity}</span>
                        <div className="flex items-center gap-2">
                          <span>{item.totalPrice.toLocaleString()}</span>
                          {o.status === "COMPLETED" && (
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => openReview(o.id, (item as any).productId || item.id, item.productName)}>
                              <MessageSquare className="h-3 w-3 mr-1" />{t("review.write")}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
