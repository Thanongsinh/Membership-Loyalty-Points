"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRewards, redeemReward } from "@/services/reward.service";
import { getMyProfile } from "@/services/member.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { SkeletonCardGrid } from "@/components/layout/skeleton-cards";
import { PageTransition } from "@/components/layout/page-transition";

export default function PortalRewardsPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const { data: rewardsData, isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: () => getRewards(1, 50),
  });
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  const redeemMut = useMutation({
    mutationFn: redeemReward,
    onSuccess: () => {
      setMessage("Redeemed successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
    onError: (e: any) => setMessage(e.response?.data?.message || "Failed to redeem"),
  });

  return (
    <PageTransition>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Rewards</h2>
        <p className="text-muted-foreground">Your points: <strong>{profile?.currentPoints.toLocaleString()}</strong></p>
        {message && <p className="rounded bg-muted p-3 text-sm">{message}</p>}
        {isLoading ? <SkeletonCardGrid /> : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rewardsData?.data.map((r) => (
              <Card key={r.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{r.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {r.description && <p className="text-sm text-muted-foreground">{r.description}</p>}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{r.pointsCost.toLocaleString()} pts</Badge>
                    <span className="text-sm text-muted-foreground">Stock: {r.stock}</span>
                  </div>
                  <Button
                    className="w-full"
                    disabled={!profile || profile.currentPoints < r.pointsCost || r.stock <= 0 || redeemMut.isPending}
                    onClick={() => redeemMut.mutate(r.id)}
                  >
                    {r.stock <= 0 ? "Out of Stock" : "Redeem"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
