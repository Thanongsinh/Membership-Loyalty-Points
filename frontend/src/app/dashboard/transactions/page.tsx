"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services/transaction.service";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const typeColor: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  EARN: "default",
  REDEEM: "destructive",
  ADJUST: "secondary",
  EXPIRE: "outline",
};

export default function TransactionsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(1, 50),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Transactions</h2>
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
