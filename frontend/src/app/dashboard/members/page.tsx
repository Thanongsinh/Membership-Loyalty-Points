"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMembers } from "@/services/member.service";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

const tierVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  BRONZE: "outline",
  SILVER: "secondary",
  GOLD: "default",
  PLATINUM: "destructive",
};

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["members", search, tier],
    queryFn: () => getMembers(1, 50, search || undefined, tier || undefined),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Members</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-60" />
          </div>
          <select value={tier} onChange={(e) => setTier(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
            <option value="">All Tiers</option>
            <option value="BRONZE">Bronze</option>
            <option value="SILVER">Silver</option>
            <option value="GOLD">Gold</option>
            <option value="PLATINUM">Platinum</option>
          </select>
        </div>
      </div>
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
