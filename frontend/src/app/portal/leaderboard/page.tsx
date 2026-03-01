"use client";
import { useQuery } from "@tanstack/react-query";
import { getPointsLeaderboard } from "@/services/leaderboard.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/layout/page-transition";
import { SkeletonTable } from "@/components/layout/skeleton-cards";
import { Trophy } from "lucide-react";

const medals = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const { data = [], isLoading } = useQuery({ queryKey: ["leaderboard"], queryFn: () => getPointsLeaderboard(20) });

  return (
    <PageTransition>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" />Leaderboard</h2>
        {isLoading ? <SkeletonTable rows={10} /> : (
          <div className="space-y-2">
            {data.map((m, i) => (
              <Card key={m.id} className={i < 3 ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20" : ""}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold w-10 text-center">{i < 3 ? medals[i] : `#${i + 1}`}</span>
                    <div>
                      <p className="font-medium">{m.firstName} {m.lastName}</p>
                      <Badge variant="outline">{m.tier}</Badge>
                    </div>
                  </div>
                  <span className="font-bold text-lg">{m.totalPoints.toLocaleString()} pts</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
