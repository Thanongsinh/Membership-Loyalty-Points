"use client";
import { useQuery } from "@tanstack/react-query";
import { getPointsLeaderboard } from "@/services/leaderboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

const medals = ["🥇", "🥈", "🥉"];

export function LeaderboardCard() {
  const { data = [] } = useQuery({ queryKey: ["leaderboard-top3"], queryFn: () => getPointsLeaderboard(3) });
  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" />Top Members</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {data.map((m, i) => (
          <div key={m.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{medals[i]}</span>
              <div>
                <p className="font-medium text-sm">{m.firstName} {m.lastName}</p>
                <Badge variant="outline" className="text-xs">{m.tier}</Badge>
              </div>
            </div>
            <span className="font-bold text-sm">{m.totalPoints.toLocaleString()} pts</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
