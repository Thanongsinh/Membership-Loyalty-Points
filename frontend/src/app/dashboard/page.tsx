"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDashboardAnalytics, exportCsv } from "@/services/analytics.service";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Coins, Gift, TrendingUp, Download } from "lucide-react";

const TIER_COLORS = { BRONZE: "#cd7f32", SILVER: "#c0c0c0", GOLD: "#ffd700", PLATINUM: "#e5e4e2" };

export default function DashboardPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data: analytics } = useQuery({
    queryKey: ["analytics", from, to],
    queryFn: () => getDashboardAnalytics(from || undefined, to || undefined),
  });

  const stats = [
    { label: "Total Members", value: analytics?.totalMembers ?? 0, icon: Users },
    { label: "Points Earned", value: (analytics?.totalPointsEarned ?? 0).toLocaleString(), icon: Coins },
    { label: "Points Redeemed", value: (analytics?.totalPointsRedeemed ?? 0).toLocaleString(), icon: Gift },
    { label: "Transactions", value: analytics?.totalTransactions ?? 0, icon: TrendingUp },
  ];

  const tierData = analytics?.tierCounts
    ? Object.entries(analytics.tierCounts).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
          <span>to</span>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
          <Button variant="outline" size="sm" onClick={() => exportCsv("members", from, to)}>
            <Download className="mr-1 h-4 w-4" /> Members CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportCsv("transactions", from, to)}>
            <Download className="mr-1 h-4 w-4" /> Transactions CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Points Activity</CardTitle></CardHeader>
          <CardContent>
            {analytics?.dailyChart && analytics.dailyChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.dailyChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="earned" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} name="Earned" />
                  <Area type="monotone" dataKey="redeemed" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.2} name="Redeemed" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tier Distribution</CardTitle></CardHeader>
          <CardContent>
            {tierData.some((t) => t.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={tierData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                    {tierData.map((entry) => (
                      <Cell key={entry.name} fill={TIER_COLORS[entry.name as keyof typeof TIER_COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-muted-foreground">No members yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
