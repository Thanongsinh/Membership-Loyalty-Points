"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { getStores, createStore, deleteStore } from "@/services/store.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function StoresPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", address: "", phone: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["stores", search],
    queryFn: () => getStores(1, 50, search || undefined),
  });

  const createMut = useMutation({
    mutationFn: () => createStore(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["stores"] }); setOpen(false); setForm({ name: "", description: "", address: "", phone: "" }); },
  });

  const deleteMut = useMutation({
    mutationFn: deleteStore,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stores"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("store.title")}</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-60" />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("store.add")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("store.add")}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>{t("store.name")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>{t("store.description")}</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div><Label>{t("store.address")}</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                <div><Label>{t("store.phone")}</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <Button onClick={() => createMut.mutate()} disabled={!form.name || createMut.isPending}>{t("save")}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {isLoading ? <p>{t("loading")}</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("store.name")}</TableHead>
              <TableHead>{t("store.address")}</TableHead>
              <TableHead>{t("store.phone")}</TableHead>
              <TableHead>{t("store.status")}</TableHead>
              <TableHead>{t("store.products")}</TableHead>
              <TableHead>{t("store.staff")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <Link href={`/dashboard/stores/${s.id}`} className="text-primary underline">{s.name}</Link>
                </TableCell>
                <TableCell>{s.address || "-"}</TableCell>
                <TableCell>{s.phone || "-"}</TableCell>
                <TableCell><Badge variant={s.isActive ? "default" : "secondary"}>{s.isActive ? t("store.active") : t("store.inactive")}</Badge></TableCell>
                <TableCell>{s._count?.products ?? 0}</TableCell>
                <TableCell>{s._count?.staff ?? 0}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) deleteMut.mutate(s.id); }}>
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
