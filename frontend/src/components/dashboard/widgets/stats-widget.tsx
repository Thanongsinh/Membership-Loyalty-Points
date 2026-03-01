"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

export function StatsWidget({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}</div>
            {stat.change !== undefined && (
              <p className={`text-xs flex items-center gap-1 mt-1 ${stat.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stat.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.change >= 0 ? "+" : ""}{stat.change}%
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
