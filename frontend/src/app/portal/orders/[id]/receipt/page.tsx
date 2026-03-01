"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getReceipt } from "@/services/receipt.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const { data: receipt, isLoading } = useQuery({ queryKey: ["receipt", id], queryFn: () => getReceipt(id) });

  if (isLoading || !receipt) return <p>{t("loading")}</p>;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("receipt.title")}</h2>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-1" />{t("receipt.print")}
        </Button>
      </div>
      <Card className="print:shadow-none">
        <CardHeader className="text-center border-b">
          <CardTitle>{receipt.store?.name}</CardTitle>
          <p className="text-sm text-muted-foreground">#{receipt.orderNumber.slice(0, 8)}</p>
          <p className="text-xs text-muted-foreground">{new Date(receipt.date).toLocaleString()}</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            {receipt.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>{item.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 space-y-1 text-sm">
            <div className="flex justify-between"><span>{t("receipt.subtotal")}</span><span>{receipt.subtotal.toLocaleString()}</span></div>
            {receipt.discount > 0 && <div className="flex justify-between text-green-600"><span>{t("receipt.discount")}</span><span>-{receipt.discount.toLocaleString()}</span></div>}
            {receipt.pointsUsed > 0 && <div className="flex justify-between"><span>{t("receipt.pointsUsed")}</span><span>{receipt.pointsUsed.toLocaleString()} pts</span></div>}
            <div className="flex justify-between font-bold text-base border-t pt-1">
              <span>{t("store.total")}</span>
              <span>{receipt.paymentMethod === "POINTS" ? `${receipt.pointsUsed} pts` : receipt.total.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground pt-2">
            <p>{receipt.paymentMethod} | {receipt.status}</p>
            <p>{t("receipt.thanks")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
