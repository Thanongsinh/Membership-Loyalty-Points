"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { earnPoints, adjustPoints } from "@/services/points.service";
import { getMembers } from "@/services/member.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PointsPage() {
  const { data: membersData } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(1, 100),
  });

  const [earnForm, setEarnForm] = useState({ memberId: "", points: 0, description: "" });
  const [adjustForm, setAdjustForm] = useState({ memberId: "", points: 0, description: "" });
  const [message, setMessage] = useState("");

  const earnMut = useMutation({
    mutationFn: () => earnPoints(earnForm.memberId, earnForm.points, earnForm.description),
    onSuccess: (m) => setMessage(`Earned! ${m?.firstName} now has ${m?.currentPoints} points`),
    onError: (e: any) => setMessage(e.response?.data?.message || "Error"),
  });

  const adjustMut = useMutation({
    mutationFn: () => adjustPoints(adjustForm.memberId, adjustForm.points, adjustForm.description),
    onSuccess: (m) => setMessage(`Adjusted! ${m?.firstName} now has ${m?.currentPoints} points`),
    onError: (e: any) => setMessage(e.response?.data?.message || "Error"),
  });

  const members = membersData?.data || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Points Management</h2>
      {message && <p className="rounded bg-muted p-3 text-sm">{message}</p>}
      <Tabs defaultValue="earn">
        <TabsList>
          <TabsTrigger value="earn">Earn Points</TabsTrigger>
          <TabsTrigger value="adjust">Adjust Points</TabsTrigger>
        </TabsList>
        <TabsContent value="earn">
          <Card>
            <CardHeader><CardTitle>Add Points</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); earnMut.mutate(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Member</Label>
                  <select className="w-full rounded border p-2" value={earnForm.memberId} onChange={(e) => setEarnForm((p) => ({ ...p, memberId: e.target.value }))} required>
                    <option value="">Select member...</option>
                    {members.map((m) => <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.user?.email})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input type="number" min={1} value={earnForm.points} onChange={(e) => setEarnForm((p) => ({ ...p, points: +e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={earnForm.description} onChange={(e) => setEarnForm((p) => ({ ...p, description: e.target.value }))} />
                </div>
                <Button type="submit" disabled={earnMut.isPending}>Add Points</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="adjust">
          <Card>
            <CardHeader><CardTitle>Adjust Points</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); adjustMut.mutate(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Member</Label>
                  <select className="w-full rounded border p-2" value={adjustForm.memberId} onChange={(e) => setAdjustForm((p) => ({ ...p, memberId: e.target.value }))} required>
                    <option value="">Select member...</option>
                    {members.map((m) => <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.user?.email})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Points (negative to deduct)</Label>
                  <Input type="number" value={adjustForm.points} onChange={(e) => setAdjustForm((p) => ({ ...p, points: +e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={adjustForm.description} onChange={(e) => setAdjustForm((p) => ({ ...p, description: e.target.value }))} />
                </div>
                <Button type="submit" disabled={adjustMut.isPending}>Adjust</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
