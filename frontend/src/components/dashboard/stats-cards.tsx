"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Coins, Gift, TrendingUp } from "lucide-react";
import { Member, Transaction } from "@/domain/entities/types";

interface Props {
  members: Member[];
  transactions: Transaction[];
}

export function StatsCards({ members, transactions }: Props) {
  const totalMembers = members.length;
  const totalPointsIssued = transactions
    .filter((t) => t.type === "EARN")
    .reduce((sum, t) => sum + t.points, 0);
  const totalRedemptions = transactions.filter((t) => t.type === "REDEEM").length;
  const avgPoints = totalMembers > 0
    ? Math.round(members.reduce((sum, m) => sum + m.currentPoints, 0) / totalMembers)
    : 0;

  const stats = [
    { label: "Total Members", value: totalMembers, icon: Users },
    { label: "Points Issued", value: totalPointsIssued.toLocaleString(), icon: Coins },
    { label: "Redemptions", value: totalRedemptions, icon: Gift },
    { label: "Avg Points/Member", value: avgPoints.toLocaleString(), icon: TrendingUp },
  ];

  return (
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
  );
}
