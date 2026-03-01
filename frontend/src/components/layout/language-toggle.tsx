"use client";

import { useI18n, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  const toggle = () => {
    setLocale(locale === "en" ? "la" : "en");
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggle} className="gap-1">
      <Languages className="h-4 w-4" />
      {locale === "en" ? "EN" : "LA"}
    </Button>
  );
}
