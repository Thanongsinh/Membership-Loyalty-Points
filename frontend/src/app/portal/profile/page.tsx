"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile } from "@/services/member.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });
  const [form, setForm] = useState<{ firstName: string; lastName: string; phone: string } | null>(null);

  const updateMut = useMutation({
    mutationFn: () => updateMyProfile(form!),
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Update failed"),
  });

  if (isLoading) return <p>Loading...</p>;
  if (!profile) return <p>Error</p>;

  const currentForm = form || { firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone || "" };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile</h2>
      <Card>
        <CardHeader><CardTitle>Edit Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); updateMut.mutate(); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={currentForm.firstName} onChange={(e) => setForm({ ...currentForm, firstName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={currentForm.lastName} onChange={(e) => setForm({ ...currentForm, lastName: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={currentForm.phone} onChange={(e) => setForm({ ...currentForm, phone: e.target.value })} />
            </div>
            <Button type="submit" disabled={updateMut.isPending}>Save</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
