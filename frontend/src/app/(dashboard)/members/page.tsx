"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMembers } from "@/services/member.service";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const tierVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  BRONZE: "outline",
  SILVER: "secondary",
  GOLD: "default",
  PLATINUM: "destructive",
};

export default function MembersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(1, 50),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Members</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Current Points</TableHead>
              <TableHead>Total Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <Link href={`/dashboard/members/${m.id}`} className="text-primary underline">
                    {m.firstName} {m.lastName}
                  </Link>
                </TableCell>
                <TableCell>{m.user?.email}</TableCell>
                <TableCell><Badge variant={tierVariant[m.tier]}>{m.tier}</Badge></TableCell>
                <TableCell>{m.currentPoints.toLocaleString()}</TableCell>
                <TableCell>{m.totalPoints.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
