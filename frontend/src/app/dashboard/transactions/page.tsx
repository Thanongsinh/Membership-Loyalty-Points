"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services/transaction.service";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

const typeColor: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  EARN: "default",
  REDEEM: "destructive",
  ADJUST: "secondary",
  EXPIRE: "outline",
};

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", search, type],
    queryFn: () => getTransactions(1, 50, type || undefined, search || undefined),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-60" />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
            <option value="">All Types</option>
            <option value="EARN">Earn</option>
            <option value="REDEEM">Redeem</option>
            <option value="ADJUST">Adjust</option>
            <option value="EXPIRE">Expire</option>
          </select>
        </div>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{t.member?.firstName} {t.member?.lastName}</TableCell>
                <TableCell><Badge variant={typeColor[t.type]}>{t.type}</Badge></TableCell>
                <TableCell className={t.points > 0 ? "text-green-600" : "text-red-600"}>
                  {t.points > 0 ? "+" : ""}{t.points}
                </TableCell>
                <TableCell>{t.description || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
