"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingCart, ShoppingBag, UserCircle } from "lucide-react";

export function MobileTabs() {
  const pathname = usePathname();

  const tabs = [
    { href: "/portal", label: "Home", icon: Home },
    { href: "/portal/stores", label: "Stores", icon: Store },
    { href: "/portal/cart", label: "Cart", icon: ShoppingCart },
    { href: "/portal/orders", label: "Orders", icon: ShoppingBag },
    { href: "/portal/profile", label: "Profile", icon: UserCircle },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-card border-t md:hidden">
      <div className="flex justify-around items-center h-14">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
