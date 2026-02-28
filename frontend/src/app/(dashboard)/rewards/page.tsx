"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRewards, createReward, deleteReward } from "@/services/reward.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function RewardsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: () => getRewards(1, 50),
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", pointsCost: 0, stock: 0 });

  const createMut = useMutation({
    mutationFn: () => createReward(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      setOpen(false);
      setForm({ name: "", description: "", pointsCost: 0, stock: 0 });
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteReward,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rewards"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Rewards</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Reward</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Reward</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createMut.mutate(); }} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Points Cost</Label>
                  <Input type="number" value={form.pointsCost} onChange={(e) => setForm((p) => ({ ...p, pointsCost: +e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: +e.target.value }))} required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createMut.isPending}>Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Points Cost</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.pointsCost.toLocaleString()}</TableCell>
                <TableCell>{r.stock}</TableCell>
                <TableCell><Badge variant={r.isActive ? "default" : "secondary"}>{r.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => deleteMut.mutate(r.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
