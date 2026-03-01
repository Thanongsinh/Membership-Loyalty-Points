"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPromotions, createPromotion, deletePromotion } from "@/services/promotion.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export default function PromotionsPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", type: "PERCENTAGE", value: "", minOrderAmount: "", maxUses: "0", startDate: "", endDate: "" });

  const { data, isLoading } = useQuery({ queryKey: ["promotions"], queryFn: () => getPromotions(1, 50) });

  const createMut = useMutation({
    mutationFn: () => createPromotion({
      ...form,
      value: parseFloat(form.value),
      minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : undefined,
      maxUses: parseInt(form.maxUses),
      startDate: form.startDate,
      endDate: form.endDate,
    } as any),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["promotions"] });
      setOpen(false);
      toast.success("Promotion created successfully!");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed to create promotion"),
  });

  const deleteMut = useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["promotions"] });
      toast.success("Promotion deleted!");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed to delete promotion"),
  });

  const typeLabel: Record<string, string> = { PERCENTAGE: "%", FIXED: "Fixed", BUY_X_GET_Y: "Buy X Get Y", BONUS_POINTS: "Bonus Pts" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("promo.title")}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("promo.add")}</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{t("promo.add")}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>{t("promo.code")}</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></div>
              <div><Label>{t("promo.name")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div>
                <Label>{t("promo.type")}</Label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm">
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed Amount</option>
                  <option value="BONUS_POINTS">Bonus Points</option>
                </select>
              </div>
              <div><Label>{t("promo.value")}</Label><Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>
              <div><Label>{t("promo.minOrder")}</Label><Input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} /></div>
              <div><Label>{t("promo.maxUses")}</Label><Input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} /></div>
              <div><Label>{t("promo.startDate")}</Label><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
              <div><Label>{t("promo.endDate")}</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
            </div>
            <Button onClick={() => createMut.mutate()} disabled={!form.code || !form.name || !form.value}>{t("save")}</Button>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <p>{t("loading")}</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("promo.code")}</TableHead>
              <TableHead>{t("promo.name")}</TableHead>
              <TableHead>{t("promo.type")}</TableHead>
              <TableHead>{t("promo.value")}</TableHead>
              <TableHead>{t("promo.usage")}</TableHead>
              <TableHead>{t("promo.period")}</TableHead>
              <TableHead>{t("store.status")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono font-bold">{p.code}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{typeLabel[p.type]}</TableCell>
                <TableCell>{p.value}{p.type === "PERCENTAGE" ? "%" : ""}</TableCell>
                <TableCell>{p.usedCount}/{p.maxUses || "∞"}</TableCell>
                <TableCell className="text-xs">{new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}</TableCell>
                <TableCell><Badge variant={p.isActive ? "default" : "secondary"}>{p.isActive ? t("store.active") : t("store.inactive")}</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) deleteMut.mutate(p.id); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
