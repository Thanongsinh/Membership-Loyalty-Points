"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMembers } from "@/services/member.service";
import { getTransactions } from "@/services/transaction.service";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PointsChart } from "@/components/dashboard/points-chart";
import { TierDistribution } from "@/components/dashboard/tier-distribution";

export default function DashboardPage() {
  const { data: membersData } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(1, 100),
  });

  const { data: txData } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(1, 100),
  });

  const members = membersData?.data || [];
  const transactions = txData?.data || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <StatsCards members={members} transactions={transactions} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Points Activity</CardTitle></CardHeader>
          <CardContent><PointsChart transactions={transactions} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tier Distribution</CardTitle></CardHeader>
          <CardContent><TierDistribution members={members} /></CardContent>
        </Card>
      </div>
    </div>
  );
}
