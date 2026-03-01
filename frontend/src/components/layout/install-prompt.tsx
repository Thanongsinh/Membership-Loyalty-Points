"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X } from "lucide-react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem("pwa-dismissed");
      if (!dismissed) setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("pwa-dismissed", "1");
  };

  if (!show) return null;

  return (
    <Card className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 shadow-lg border-primary">
      <CardContent className="flex items-center gap-3 p-3">
        <Download className="h-8 w-8 text-primary shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-sm">Install App</p>
          <p className="text-xs text-muted-foreground">Add to home screen for a better experience</p>
        </div>
        <div className="flex gap-1">
          <Button size="sm" onClick={install}>Install</Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={dismiss}><X className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}
