"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Gift, History, UserCircle, LogOut, Users, Trophy } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { NotificationBell } from "./notification-bell";
import { useI18n } from "@/lib/i18n";

const navItems = [
  { href: "/portal", labelKey: "nav.home", icon: Home },
  { href: "/portal/rewards", labelKey: "nav.rewards", icon: Gift },
  { href: "/portal/history", labelKey: "nav.history", icon: History },
  { href: "/portal/referrals", labelKey: "nav.referrals", icon: Users },
  { href: "/portal/gamification", labelKey: "nav.checkin", icon: Trophy },
  { href: "/portal/profile", labelKey: "nav.profile", icon: UserCircle },
];

export function PortalNav() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const { t } = useI18n();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <h1 className="text-lg font-bold">{t("app.name")}</h1>
        <NotificationBell />
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
