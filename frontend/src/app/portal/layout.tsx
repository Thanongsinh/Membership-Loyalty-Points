"use client";

import { PortalNav } from "@/components/layout/portal-nav";
import { Navbar } from "@/components/layout/navbar";
import { MobileTabs } from "@/components/layout/mobile-tabs";
import { ComparisonBar } from "@/components/rewards/comparison-bar";
import { InstallPrompt } from "@/components/layout/install-prompt";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <PortalNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 pb-16 md:pb-6">{children}</main>
      </div>
      <ComparisonBar />
      <InstallPrompt />
      <MobileTabs />
    </div>
  );
}
