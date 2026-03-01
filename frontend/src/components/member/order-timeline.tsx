"use client";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, ChefHat, Package, Star, XCircle } from "lucide-react";

const STEPS = [
  { key: "PENDING", icon: Clock, label: "Placed" },
  { key: "CONFIRMED", icon: Check, label: "Confirmed" },
  { key: "PREPARING", icon: ChefHat, label: "Preparing" },
  { key: "READY", icon: Package, label: "Ready" },
  { key: "COMPLETED", icon: Star, label: "Completed" },
];

export function OrderTimeline({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <XCircle className="h-5 w-5" />
        <span className="font-medium">Order Cancelled</span>
      </div>
    );
  }
  const currentIdx = STEPS.findIndex((s) => s.key === status);
  const progress = currentIdx >= 0 ? ((currentIdx + 1) / STEPS.length) * 100 : 0;

  return (
    <div className="space-y-3">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between">
        {STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const Icon = step.icon;
          return (
            <div key={step.key} className={`flex flex-col items-center gap-1 ${done ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`rounded-full p-1.5 ${done ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
