"use client";

import { PortalNav } from "@/components/layout/portal-nav";
import { Navbar } from "@/components/layout/navbar";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <PortalNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
