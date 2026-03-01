"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStaffOrders, updateStaffOrderStatus } from "@/services/staff.service";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n } from "@/lib/i18n";
import { OrderStatus } from "@/domain/entities/types";

const statuses: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

export default function StaffOrdersPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["staff-orders", statusFilter], queryFn: () => getStaffOrders(1, 50, statusFilter || undefined) });

  const updateMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateStaffOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff-orders"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("staff.orders")}</h2>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
          <option value="">{t("order.allStatuses")}</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {isLoading ? <p>{t("loading")}</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("store.orderNumber")}</TableHead>
              <TableHead>{t("store.member")}</TableHead>
              <TableHead>{t("store.payment")}</TableHead>
              <TableHead>{t("store.total")}</TableHead>
              <TableHead>{t("store.orderStatus")}</TableHead>
              <TableHead>{t("store.date")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono">{o.orderNumber.slice(0, 8)}</TableCell>
                <TableCell>{o.member ? `${o.member.firstName} ${o.member.lastName}` : "-"}</TableCell>
                <TableCell><Badge variant="outline">{o.paymentMethod}</Badge></TableCell>
                <TableCell>{o.paymentMethod === "POINTS" ? `${o.pointsUsed} pts` : o.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <select value={o.status} onChange={(e) => updateMut.mutate({ id: o.id, status: e.target.value })} className="rounded-md border px-2 py-1 text-xs">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </TableCell>
                <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
