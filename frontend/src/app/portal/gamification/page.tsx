"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { checkIn, getBadges, CheckInResult } from "@/services/gamification.service";
import { useState } from "react";

export default function GamificationPage() {
  const qc = useQueryClient();
  const { data: badges = [] } = useQuery({ queryKey: ["badges"], queryFn: getBadges });
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [error, setError] = useState("");

  const checkInMut = useMutation({
    mutationFn: checkIn,
    onSuccess: (data) => {
      setResult(data);
      setError("");
      qc.invalidateQueries({ queryKey: ["badges"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Check-in failed");
      setResult(null);
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Daily Check-in & Badges</h2>

      <Card>
        <CardHeader><CardTitle>Daily Check-in</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Check in daily to earn points! Every 7th day gets a bonus.
          </p>
          <Button onClick={() => checkInMut.mutate()} disabled={checkInMut.isPending} size="lg">
            Check In Today
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {result && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-1">
              <p className="font-medium">Check-in successful!</p>
              <p className="text-sm">Streak: <strong>{result.streak} days</strong></p>
              <p className="text-sm">Points earned: <strong>+{result.points}</strong></p>
              {result.bonusPoints > 0 && (
                <p className="text-sm text-green-600">Streak bonus: +{result.bonusPoints}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {badges.map((badge) => (
              <div
                key={badge.key}
                className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition ${
                  badge.earned ? "bg-primary/5 border-primary" : "opacity-40 grayscale"
                }`}
              >
                <span className="text-3xl">{badge.icon}</span>
                <span className="text-sm font-medium">{badge.name}</span>
                <span className="text-xs text-muted-foreground">{badge.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
