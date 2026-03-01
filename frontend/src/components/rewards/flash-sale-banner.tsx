"use client";
import { useQuery } from "@tanstack/react-query";
import { getFlashSales } from "@/services/flash-sale.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "./countdown-timer";
import { Zap } from "lucide-react";

export function FlashSaleBanner() {
  const { data: sales = [] } = useQuery({ queryKey: ["flash-sales"], queryFn: getFlashSales, refetchInterval: 60000 });
  if (sales.length === 0) return null;

  return (
    <Card className="border-orange-400 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-5 w-5 text-orange-500" />
          <span className="font-bold text-lg">Flash Sales</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sales.slice(0, 3).map((sale) => (
            <div key={sale.id} className="bg-white dark:bg-card rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{sale.name}</span>
                <Badge variant="destructive" className="text-xs">{sale.type === "PERCENTAGE" ? `${sale.value}% OFF` : sale.type === "BONUS_POINTS" ? `+${sale.value} pts` : `${sale.value} OFF`}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Code: <code className="font-mono">{sale.code}</code></span>
                <CountdownTimer endDate={sale.endDate} />
              </div>
              {sale.flashSaleStock !== null && (
                <div className="mt-1 text-xs text-muted-foreground">{sale.flashSaleStock} remaining</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
