"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getAuditLogs, AuditLog } from "@/services/audit-log.service";

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", page],
    queryFn: () => getAuditLogs(page, 20),
  });

  if (isLoading) return <p>Loading...</p>;

  const logs = data?.data || [];
  const meta = data?.meta;

  const actionColor = (action: string) => {
    if (action.includes("CREATE")) return "default";
    if (action.includes("DELETE")) return "destructive";
    if (action.includes("TOGGLE")) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Audit Logs</h2>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {logs.map((log: AuditLog) => (
              <div key={log.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <Badge variant={actionColor(log.action) as any}>{log.action}</Badge>
                  <Badge variant="outline">{log.entity}</Badge>
                  <span className="text-sm">{log.entityId?.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{log.userId.slice(0, 8)}...</span>
                  <span>{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {logs.length === 0 && <p className="text-center text-muted-foreground">No audit logs yet</p>}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span className="text-sm py-2">Page {page} of {meta.totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
