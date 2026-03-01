"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getMemberById } from "@/services/member.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: member, isLoading } = useQuery({
    queryKey: ["member", id],
    queryFn: () => getMemberById(id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (!member) return <p>Member not found</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{member.firstName} {member.lastName}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm">Tier</CardTitle></CardHeader>
          <CardContent><Badge>{member.tier}</Badge></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Current Points</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{member.currentPoints.toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Total Points</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{member.totalPoints.toLocaleString()}</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p><span className="font-medium">Email:</span> {member.user?.email}</p>
          <p><span className="font-medium">Phone:</span> {member.phone || "N/A"}</p>
          <p><span className="font-medium">Joined:</span> {new Date(member.createdAt).toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
