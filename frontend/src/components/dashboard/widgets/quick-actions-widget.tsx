"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Gift, Store, Megaphone, Zap } from "lucide-react";
import Link from "next/link";

const actions = [
  { label: "Add Member", href: "/dashboard/members", icon: UserPlus },
  { label: "Add Reward", href: "/dashboard/rewards", icon: Gift },
  { label: "Manage Stores", href: "/dashboard/stores", icon: Store },
  { label: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
];

export function QuickActionsWidget() {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5" />Quick Actions</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((a) => (
            <Link key={a.href} href={a.href}>
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                <a.icon className="h-4 w-4" />
                <span className="text-sm">{a.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
