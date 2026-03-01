"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { getSystemSettings, updateSettingValue, SystemSetting } from "@/services/system-setting.service";

export default function SettingsPage() {
  const qc = useQueryClient();
  const { data: settings = [], isLoading } = useQuery({ queryKey: ["settings"], queryFn: getSystemSettings });
  const [editing, setEditing] = useState<Record<string, string>>({});

  const updateMut = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => updateSettingValue(id, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });

  if (isLoading) return <p>Loading...</p>;

  // Group settings by group
  const grouped = settings.reduce<Record<string, SystemSetting[]>>((acc, s) => {
    (acc[s.group] = acc[s.group] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Settings</h2>

      {Object.entries(grouped).map(([group, items]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle className="capitalize">{group}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((setting) => (
              <div key={setting.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{setting.label}</span>
                    <Badge variant="outline" className="text-xs">{setting.type}</Badge>
                  </div>
                  {setting.description && <p className="text-xs text-muted-foreground">{setting.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    className="w-48"
                    value={editing[setting.id] ?? setting.value}
                    onChange={(e) => setEditing({ ...editing, [setting.id]: e.target.value })}
                  />
                  {editing[setting.id] !== undefined && editing[setting.id] !== setting.value && (
                    <Button
                      size="sm"
                      onClick={() => {
                        updateMut.mutate({ id: setting.id, value: editing[setting.id] });
                        setEditing((prev) => {
                          const next = { ...prev };
                          delete next[setting.id];
                          return next;
                        });
                      }}
                      disabled={updateMut.isPending}
                    >
                      Save
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
