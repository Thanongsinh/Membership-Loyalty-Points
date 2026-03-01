"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/product-category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ProductCategory } from "@/domain/entities/types";

export default function CategoriesPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<ProductCategory | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createMut = useMutation({
    mutationFn: () => createCategory(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); setOpen(false); setForm({ name: "", description: "" }); },
  });

  const updateMut = useMutation({
    mutationFn: () => updateCategory(editItem!.id, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); setEditItem(null); },
  });

  const deleteMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("category.title")}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("category.add")}</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t("category.add")}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>{t("category.name")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>{t("store.description")}</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <Button onClick={() => createMut.mutate()} disabled={!form.name}>{t("save")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {editItem && (
        <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{t("category.edit")}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>{t("category.name")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>{t("store.description")}</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <Button onClick={() => updateMut.mutate()}>{t("save")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {isLoading ? <p>{t("loading")}</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("category.name")}</TableHead>
              <TableHead>{t("store.description")}</TableHead>
              <TableHead>{t("store.products")}</TableHead>
              <TableHead>{t("store.status")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.description || "-"}</TableCell>
                <TableCell>{c._count?.products ?? 0}</TableCell>
                <TableCell><Badge variant={c.isActive ? "default" : "secondary"}>{c.isActive ? t("store.active") : t("store.inactive")}</Badge></TableCell>
                <TableCell className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setForm({ name: c.name, description: c.description || "" }); setEditItem(c); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) deleteMut.mutate(c.id); }}>
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
