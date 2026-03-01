"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPointsHistory } from "@/services/points-history.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const PERIODS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

export function PointsChart() {
  const [days, setDays] = useState(30);
  const { data = [] } = useQuery({ queryKey: ["points-history", days], queryFn: () => getPointsHistory(days) });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Points Activity</CardTitle>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <Button key={p.days} variant={days === p.days ? "default" : "outline"} size="sm" onClick={() => setDays(p.days)}>
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No activity in this period</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="earned" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Earned" />
              <Area type="monotone" dataKey="spent" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Spent" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
