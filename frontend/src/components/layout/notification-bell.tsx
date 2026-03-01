"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, Notification } from "@/services/notification.service";

export function NotificationBell() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: count = 0 } = useQuery({
    queryKey: ["notification-count"],
    queryFn: getUnreadCount,
    refetchInterval: 30000,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
    enabled: open,
  });

  const readMut = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notification-count"] });
    },
  });

  const readAllMut = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notification-count"] });
    },
  });

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setOpen(!open)} className="relative">
        🔔
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </Button>

      {open && (
        <Card className="absolute right-0 top-10 w-80 z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">Notifications</span>
              {count > 0 && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => readAllMut.mutate()}>
                  Mark all read
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {notifications.map((n: Notification) => (
                <div
                  key={n.id}
                  className={`p-2 rounded text-sm cursor-pointer ${n.isRead ? "opacity-60" : "bg-muted"}`}
                  onClick={() => !n.isRead && readMut.mutate(n.id)}
                >
                  <div className="font-medium">{n.title}</div>
                  <div className="text-muted-foreground text-xs">{n.message}</div>
                  <div className="text-muted-foreground text-xs mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
              ))}
              {notifications.length === 0 && <p className="text-center text-muted-foreground text-sm py-4">No notifications</p>}
            </div>
            <div className="border-t mt-2 pt-2 text-center">
              <Link href="/portal/notifications" onClick={() => setOpen(false)} className="text-sm text-primary hover:underline">View All</Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
