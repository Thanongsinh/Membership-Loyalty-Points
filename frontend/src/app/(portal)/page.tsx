"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/services/member.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TierBadge3D } from "@/components/member/tier-badge-3d";
import { TIER_THRESHOLDS } from "@/components/member/tier-constants";

export default function PortalHomePage() {
  const { data: member, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!member) return <p>Error loading profile</p>;

  const nextTier = member.tier === "PLATINUM" ? null
    : member.tier === "GOLD" ? "PLATINUM"
    : member.tier === "SILVER" ? "GOLD" : "SILVER";

  const pointsToNext = nextTier ? TIER_THRESHOLDS[nextTier] - member.totalPoints : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, {member.firstName}!</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Your Points</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-bold">{member.currentPoints.toLocaleString()}</p>
            <div className="flex items-center gap-2">
              <Badge>{member.tier}</Badge>
              {nextTier && (
                <span className="text-sm text-muted-foreground">
                  {pointsToNext.toLocaleString()} points to {nextTier}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tier Badge</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <TierBadge3D tier={member.tier} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
