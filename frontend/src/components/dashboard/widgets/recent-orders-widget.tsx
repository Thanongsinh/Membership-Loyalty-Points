"use client";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/services/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "outline", CONFIRMED: "secondary", PREPARING: "secondary", READY: "default", COMPLETED: "default", CANCELLED: "destructive",
};

export function RecentOrdersWidget() {
  const { data } = useQuery({ queryKey: ["recent-orders"], queryFn: () => getOrders(1, 5) });

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingBag className="h-5 w-5" />Recent Orders</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data?.data.map((o) => (
            <div key={o.id} className="flex items-center justify-between text-sm">
              <div>
                <span className="font-mono text-xs">{o.orderNumber.slice(0, 8)}...</span>
                <span className="text-muted-foreground ml-2">{o.member?.firstName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant[o.status]} className="text-xs">{o.status}</Badge>
                <span className="font-medium">{o.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          ))}
          {(!data || data.data.length === 0) && <p className="text-sm text-muted-foreground text-center py-4">No orders yet</p>}
        </div>
      </CardContent>
    </Card>
  );
}
