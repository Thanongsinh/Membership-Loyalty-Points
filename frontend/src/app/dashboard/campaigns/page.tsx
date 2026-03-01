"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  getCampaigns,
  createCampaign,
  updateCampaignStatus,
  deleteCampaign,
  Campaign,
} from "@/services/campaign.service";

export default function CampaignsPage() {
  const qc = useQueryClient();
  const { data: campaigns = [], isLoading } = useQuery({ queryKey: ["campaigns"], queryFn: getCampaigns });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    pointsMultiplier: 1,
    bonusPoints: 0,
    startDate: "",
    endDate: "",
  });

  const createMut = useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      setShowCreate(false);
      setForm({ name: "", description: "", pointsMultiplier: 1, bonusPoints: 0, startDate: "", endDate: "" });
    },
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Campaign["status"] }) => updateCampaignStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });

  if (isLoading) return <p>Loading...</p>;

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { ACTIVE: "default", DRAFT: "secondary", PAUSED: "outline", ENDED: "destructive" };
    return map[status] || "outline";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Campaigns</h2>
        <Button onClick={() => setShowCreate(!showCreate)}>{showCreate ? "Cancel" : "Create Campaign"}</Button>
      </div>

      {showCreate && (
        <Card>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMut.mutate(form);
              }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Points Multiplier</Label>
                <Input type="number" step="0.1" min="1" value={form.pointsMultiplier} onChange={(e) => setForm({ ...form, pointsMultiplier: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Bonus Points</Label>
                <Input type="number" min="0" value={form.bonusPoints} onChange={(e) => setForm({ ...form, bonusPoints: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
              </div>
              <Button type="submit" disabled={createMut.isPending}>Create</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {campaigns.map((c: Campaign) => (
          <Card key={c.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{c.name}</span>
                  <Badge variant={statusBadge(c.status) as any}>{c.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  x{c.pointsMultiplier} multiplier
                  {c.bonusPoints > 0 && ` | +${c.bonusPoints} bonus`}
                  {" | "}
                  {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                </p>
                {c.description && <p className="text-sm mt-1">{c.description}</p>}
              </div>
              <div className="flex gap-2">
                {c.status === "DRAFT" && (
                  <Button size="sm" onClick={() => statusMut.mutate({ id: c.id, status: "ACTIVE" })}>Activate</Button>
                )}
                {c.status === "ACTIVE" && (
                  <Button size="sm" variant="secondary" onClick={() => statusMut.mutate({ id: c.id, status: "PAUSED" })}>Pause</Button>
                )}
                {c.status === "PAUSED" && (
                  <Button size="sm" onClick={() => statusMut.mutate({ id: c.id, status: "ACTIVE" })}>Resume</Button>
                )}
                {(c.status === "DRAFT" || c.status === "PAUSED") && (
                  <Button size="sm" variant="destructive" onClick={() => statusMut.mutate({ id: c.id, status: "ENDED" })}>End</Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => deleteMut.mutate(c.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {campaigns.length === 0 && <p className="text-center text-muted-foreground">No campaigns yet</p>}
      </div>
    </div>
  );
}
