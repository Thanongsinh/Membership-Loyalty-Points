"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead, markAllAsRead, Notification } from "@/services/notification.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/layout/page-transition";
import { SkeletonTable } from "@/components/layout/skeleton-cards";
import { Bell, Check, CheckCheck } from "lucide-react";
import { useState } from "react";

const TYPES = ["ALL", "SYSTEM", "POINTS", "TIER", "REWARD", "CAMPAIGN", "EXPIRY", "ORDER", "STOCK"];

export default function NotificationsPage() {
  const qc = useQueryClient();
  const [typeFilter, setTypeFilter] = useState("ALL");
  const { data: notifications = [], isLoading } = useQuery({ queryKey: ["notifications"], queryFn: () => getNotifications() });

  const readMut = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["notifications"] }); qc.invalidateQueries({ queryKey: ["notification-count"] }); },
  });

  const readAllMut = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["notifications"] }); qc.invalidateQueries({ queryKey: ["notification-count"] }); },
  });

  const filtered = typeFilter === "ALL" ? notifications : notifications.filter((n: Notification) => n.type === typeFilter);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Bell className="h-6 w-6" />Notifications</h2>
          <Button variant="outline" size="sm" onClick={() => readAllMut.mutate()}><CheckCheck className="h-4 w-4 mr-1" />Mark All Read</Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPES.map((t) => (
            <Button key={t} variant={typeFilter === t ? "default" : "outline"} size="sm" onClick={() => setTypeFilter(t)}>{t}</Button>
          ))}
        </div>
        {isLoading ? <SkeletonTable rows={5} /> : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No notifications</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((n: Notification) => (
              <Card key={n.id} className={n.isRead ? "opacity-60" : ""}>
                <CardContent className="flex items-start justify-between p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{n.title}</span>
                      <Badge variant="outline" className="text-xs">{n.type}</Badge>
                      {!n.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.isRead && (
                    <Button variant="ghost" size="sm" onClick={() => readMut.mutate(n.id)}><Check className="h-4 w-4" /></Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
