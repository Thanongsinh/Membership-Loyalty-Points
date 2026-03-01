"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getStores } from "@/services/store.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SkeletonCardGrid } from "@/components/layout/skeleton-cards";
import { PageTransition } from "@/components/layout/page-transition";

export default function StoresPortalPage() {
  const { t } = useI18n();
  const { data, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: () => getStores(1, 50),
  });

  return (
    <PageTransition>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t("store.browse")}</h2>
        {isLoading ? <SkeletonCardGrid /> : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.data.map((s) => (
              <Link key={s.id} href={`/portal/stores/${s.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {s.name}
                      <Badge>{s._count?.products ?? 0} {t("store.products")}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    {s.address && <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.address}</p>}
                    {s.phone && <p className="flex items-center gap-1"><Phone className="h-3 w-3" />{s.phone}</p>}
                    {s.description && <p>{s.description}</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
