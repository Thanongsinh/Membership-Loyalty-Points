"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStoreById, updateStore, assignStaff, removeStaff } from "@/services/store.service";
import { getProducts, createProduct } from "@/services/product.service";
import { getOrders } from "@/services/order.service";
import { getCategories } from "@/services/product-category.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const qc = useQueryClient();
  const [editForm, setEditForm] = useState({ name: "", description: "", address: "", phone: "" });
  const [editing, setEditing] = useState(false);
  const [productForm, setProductForm] = useState({ name: "", price: "", pointsPrice: "", stock: "0", categoryId: "" });
  const [productOpen, setProductOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({ userId: "", isManager: false });
  const [staffOpen, setStaffOpen] = useState(false);

  const { data: store } = useQuery({
    queryKey: ["store", id],
    queryFn: () => getStoreById(id),
  });

  const { data: products } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProducts(1, 100, { storeId: id }),
  });

  const { data: orders } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrders(1, 50, id),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const updateMut = useMutation({
    mutationFn: () => updateStore(id, editForm),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["store", id] }); setEditing(false); },
  });

  const createProductMut = useMutation({
    mutationFn: () => createProduct({ ...productForm, storeId: id, price: parseFloat(productForm.price), pointsPrice: productForm.pointsPrice ? parseInt(productForm.pointsPrice) : undefined, stock: parseInt(productForm.stock), categoryId: productForm.categoryId || undefined } as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products", id] }); setProductOpen(false); setProductForm({ name: "", price: "", pointsPrice: "", stock: "0", categoryId: "" }); },
  });

  const assignMut = useMutation({
    mutationFn: () => assignStaff(id, staffForm.userId, staffForm.isManager),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["store", id] }); setStaffOpen(false); setStaffForm({ userId: "", isManager: false }); },
  });

  const removeMut = useMutation({
    mutationFn: (userId: string) => removeStaff(id, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["store", id] }),
  });

  if (!store) return <p>{t("loading")}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{store.name}</h2>
        <Badge variant={store.isActive ? "default" : "secondary"}>{store.isActive ? t("store.active") : t("store.inactive")}</Badge>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">{t("store.info")}</TabsTrigger>
          <TabsTrigger value="products">{t("store.products")} ({products?.meta.total ?? 0})</TabsTrigger>
          <TabsTrigger value="orders">{t("store.orders")} ({orders?.meta.total ?? 0})</TabsTrigger>
          <TabsTrigger value="staff">{t("store.staff")}</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader><CardTitle>{t("store.info")}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {editing ? (
                <>
                  <div><Label>{t("store.name")}</Label><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
                  <div><Label>{t("store.description")}</Label><Input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} /></div>
                  <div><Label>{t("store.address")}</Label><Input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} /></div>
                  <div><Label>{t("store.phone")}</Label><Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></div>
                  <div className="flex gap-2">
                    <Button onClick={() => updateMut.mutate()}>{t("save")}</Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>{t("cancel")}</Button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>{t("store.description")}:</strong> {store.description || "-"}</p>
                  <p><strong>{t("store.address")}:</strong> {store.address || "-"}</p>
                  <p><strong>{t("store.phone")}:</strong> {store.phone || "-"}</p>
                  <Button variant="outline" onClick={() => { setEditForm({ name: store.name, description: store.description || "", address: store.address || "", phone: store.phone || "" }); setEditing(true); }}>{t("store.edit")}</Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <div className="flex justify-end mb-4">
            <Dialog open={productOpen} onOpenChange={setProductOpen}>
              <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("store.addProduct")}</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{t("store.addProduct")}</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>{t("store.productName")}</Label><Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} /></div>
                  <div><Label>{t("store.price")}</Label><Input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} /></div>
                  <div><Label>{t("store.pointsPrice")}</Label><Input type="number" value={productForm.pointsPrice} onChange={(e) => setProductForm({ ...productForm, pointsPrice: e.target.value })} /></div>
                  <div><Label>{t("store.stock")}</Label><Input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} /></div>
                  <div>
                    <Label>{t("store.category")}</Label>
                    <select value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm">
                      <option value="">-</option>
                      {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <Button onClick={() => createProductMut.mutate()} disabled={!productForm.name || !productForm.price}>{t("save")}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("store.productName")}</TableHead>
                <TableHead>{t("store.category")}</TableHead>
                <TableHead>{t("store.price")}</TableHead>
                <TableHead>{t("store.pointsPrice")}</TableHead>
                <TableHead>{t("store.stock")}</TableHead>
                <TableHead>{t("store.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category?.name || "-"}</TableCell>
                  <TableCell>{p.price.toLocaleString()}</TableCell>
                  <TableCell>{p.pointsPrice?.toLocaleString() ?? "-"}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell><Badge variant={p.isActive ? "default" : "secondary"}>{p.isActive ? t("store.active") : t("store.inactive")}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="orders">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("store.orderNumber")}</TableHead>
                <TableHead>{t("store.member")}</TableHead>
                <TableHead>{t("store.orderStatus")}</TableHead>
                <TableHead>{t("store.payment")}</TableHead>
                <TableHead>{t("store.total")}</TableHead>
                <TableHead>{t("store.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.data.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono">{o.orderNumber}</TableCell>
                  <TableCell>{o.member ? `${o.member.firstName} ${o.member.lastName}` : "-"}</TableCell>
                  <TableCell><Badge>{o.status}</Badge></TableCell>
                  <TableCell>{o.paymentMethod}</TableCell>
                  <TableCell>{o.paymentMethod === "POINTS" ? `${o.pointsUsed} pts` : o.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="staff">
          <div className="flex justify-end mb-4">
            <Dialog open={staffOpen} onOpenChange={setStaffOpen}>
              <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />{t("store.assignStaff")}</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{t("store.assignStaff")}</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>User ID</Label><Input value={staffForm.userId} onChange={(e) => setStaffForm({ ...staffForm, userId: e.target.value })} /></div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={staffForm.isManager} onChange={(e) => setStaffForm({ ...staffForm, isManager: e.target.checked })} />
                    <Label>{t("store.isManager")}</Label>
                  </div>
                  <Button onClick={() => assignMut.mutate()} disabled={!staffForm.userId}>{t("save")}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-sm text-muted-foreground">{t("store.staffCount")}: {(store as any).staff?.length ?? store._count?.staff ?? 0}</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
