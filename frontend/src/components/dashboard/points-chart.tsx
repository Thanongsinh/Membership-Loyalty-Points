"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Transaction } from "@/domain/entities/types";

interface Props {
  transactions: Transaction[];
}

export function PointsChart({ transactions }: Props) {
  const grouped = transactions
    .filter((t) => t.type === "EARN")
    .reduce<Record<string, number>>((acc, t) => {
      const date = new Date(t.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + t.points;
      return acc;
    }, {});

  const data = Object.entries(grouped)
    .map(([date, points]) => ({ date, points }))
    .reverse();

  if (data.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">No data yet</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Area type="monotone" dataKey="points" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
