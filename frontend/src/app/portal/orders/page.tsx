"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "@/services/order.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "outline",
  CONFIRMED: "secondary",
  PREPARING: "secondary",
  READY: "default",
  COMPLETED: "default",
  CANCELLED: "destructive",
};

export default function MyOrdersPage() {
  const { t } = useI18n();
  const { data, isLoading } = useQuery({ queryKey: ["my-orders"], queryFn: () => getMyOrders(1, 50) });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("order.myOrders")}</h2>
      {isLoading ? <p>{t("loading")}</p> : !data || data.data.length === 0 ? (
        <p className="text-muted-foreground">{t("order.noOrders")}</p>
      ) : (
        <div className="space-y-4">
          {data.data.map((o) => (
            <Card key={o.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-mono">{o.orderNumber}</CardTitle>
                  <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{o.store?.name}</span>
                  <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{o.paymentMethod}</span>
                  <span className="font-semibold">
                    {o.paymentMethod === "POINTS" ? `${o.pointsUsed} pts` : `${o.totalAmount.toLocaleString()}`}
                  </span>
                </div>
                {o.orderItems && o.orderItems.length > 0 && (
                  <div className="pt-2 border-t space-y-1">
                    {o.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span>{item.productName} x{item.quantity}</span>
                        <span>{item.totalPrice.toLocaleString()}</span>
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
