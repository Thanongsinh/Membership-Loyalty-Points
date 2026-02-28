"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Member, Tier } from "@/domain/entities/types";

const TIER_COLORS: Record<Tier, string> = {
  BRONZE: "#CD7F32",
  SILVER: "#C0C0C0",
  GOLD: "#FFD700",
  PLATINUM: "#E5E4E2",
};

interface Props {
  members: Member[];
}

export function TierDistribution({ members }: Props) {
  const distribution = members.reduce<Record<Tier, number>>(
    (acc, m) => {
      acc[m.tier] = (acc[m.tier] || 0) + 1;
      return acc;
    },
    { BRONZE: 0, SILVER: 0, GOLD: 0, PLATINUM: 0 }
  );

  const data = Object.entries(distribution)
    .filter(([, count]) => count > 0)
    .map(([tier, count]) => ({ name: tier, value: count }));

  if (data.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">No members yet</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
          {data.map((entry) => (
            <Cell key={entry.name} fill={TIER_COLORS[entry.name as Tier]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
