"use client";

import { useQuery } from "@tanstack/react-query";
import { getStaffDashboard } from "@/services/staff.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Clock, DollarSign } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function StaffDashboardPage() {
  const { t } = useI18n();
  const { data, isLoading } = useQuery({ queryKey: ["staff-dashboard"], queryFn: getStaffDashboard });

  if (isLoading || !data) return <p>{t("loading")}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{data.store?.name} - {t("staff.dashboard")}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("staff.pendingOrders")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{data.pendingOrders}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("staff.todayOrders")}</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{data.todayOrders}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("staff.todayRevenue")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{data.todayRevenue.toLocaleString()}</div></CardContent>
        </Card>
      </div>
    </div>
  );
}
