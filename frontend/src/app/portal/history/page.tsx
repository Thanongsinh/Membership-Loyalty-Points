"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyTransactions } from "@/services/transaction.service";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function HistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-transactions"],
    queryFn: () => getMyTransactions(1, 50),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Transaction History</h2>
      {isLoading ? <p>Loading...</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                <TableCell><Badge>{t.type}</Badge></TableCell>
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
