"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/services/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderTimeline } from "@/components/member/order-timeline";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageTransition } from "@/components/layout/page-transition";
import { SkeletonTable } from "@/components/layout/skeleton-cards";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery({ queryKey: ["order", id], queryFn: () => getOrderById(id) });

  if (isLoading) return <SkeletonTable rows={5} />;
  if (!order) return <p>Order not found</p>;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/portal/orders"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h2 className="text-2xl font-bold">Order #{order.orderNumber}</h2>
          <Badge>{order.status}</Badge>
        </div>
        <Card>
          <CardHeader><CardTitle>Order Progress</CardTitle></CardHeader>
          <CardContent><OrderTimeline status={order.status} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Store</span><span>{order.store?.name}</span>
              <span className="text-muted-foreground">Date</span><span>{new Date(order.createdAt).toLocaleString()}</span>
              <span className="text-muted-foreground">Payment</span><span>{order.paymentMethod}</span>
              <span className="text-muted-foreground">Total</span><span className="font-semibold">{order.paymentMethod === "POINTS" ? `${order.pointsUsed} pts` : `${order.totalAmount.toLocaleString()} THB`}</span>
            </div>
          </CardContent>
        </Card>
        {order.orderItems && order.orderItems.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Items</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell>{item.totalPrice.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTransition>
  );
}
