"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Gift, Coins, History, LogOut, Flag, Settings, ScrollText, Megaphone, Store, Tags, ShoppingBag, Ticket,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

const navItems = [
  { href: "/dashboard", labelKey: "nav.overview", icon: LayoutDashboard },
  { href: "/dashboard/members", labelKey: "nav.members", icon: Users },
  { href: "/dashboard/rewards", labelKey: "nav.rewards", icon: Gift },
  { href: "/dashboard/points", labelKey: "nav.points", icon: Coins },
  { href: "/dashboard/transactions", labelKey: "nav.transactions", icon: History },
  { href: "/dashboard/stores", labelKey: "nav.stores", icon: Store },
  { href: "/dashboard/product-categories", labelKey: "nav.categories", icon: Tags },
  { href: "/dashboard/orders", labelKey: "nav.orders", icon: ShoppingBag },
  { href: "/dashboard/promotions", labelKey: "nav.promotions", icon: Ticket },
  { href: "/dashboard/campaigns", labelKey: "nav.campaigns", icon: Megaphone },
  { href: "/dashboard/feature-flags", labelKey: "nav.featureFlags", icon: Flag },
  { href: "/dashboard/settings", labelKey: "nav.settings", icon: Settings },
  { href: "/dashboard/audit-logs", labelKey: "nav.auditLogs", icon: ScrollText },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const { t } = useI18n();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-bold">{t("app.admin")}</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4" />
            {t(item.labelKey)}
          </Link>
        ))}
      </nav>
      <div className="border-t p-4">
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}
