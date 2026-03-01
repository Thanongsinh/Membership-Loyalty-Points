"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  getFeatureFlags,
  createFeatureFlag,
  toggleFeatureFlag,
  deleteFeatureFlag,
  FeatureFlag,
} from "@/services/feature-flag.service";

export default function FeatureFlagsPage() {
  const qc = useQueryClient();
  const { data: flags = [], isLoading } = useQuery({ queryKey: ["feature-flags"], queryFn: getFeatureFlags });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ key: "", name: "", description: "" });

  const toggleMut = useMutation({
    mutationFn: toggleFeatureFlag,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feature-flags"] }),
  });

  const createMut = useMutation({
    mutationFn: createFeatureFlag,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feature-flags"] });
      setShowCreate(false);
      setForm({ key: "", name: "", description: "" });
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteFeatureFlag,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feature-flags"] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Feature Flags</h2>
        <Button onClick={() => setShowCreate(!showCreate)}>{showCreate ? "Cancel" : "Add Flag"}</Button>
      </div>

      {showCreate && (
        <Card>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMut.mutate(form);
              }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="space-y-2">
                <Label>Key</Label>
                <Input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="e.g. new_feature" required />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Display name" required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional" />
              </div>
              <Button type="submit" disabled={createMut.isPending}>Create</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {flags.map((flag: FeatureFlag) => (
          <Card key={flag.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{flag.name}</span>
                  <Badge variant="outline">{flag.key}</Badge>
                  <Badge variant={flag.enabled ? "default" : "secondary"}>{flag.enabled ? "ON" : "OFF"}</Badge>
                </div>
                {flag.description && <p className="text-sm text-muted-foreground mt-1">{flag.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={flag.enabled ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleMut.mutate(flag.id)}
                  disabled={toggleMut.isPending}
                >
                  {flag.enabled ? "Disable" : "Enable"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteMut.mutate(flag.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
