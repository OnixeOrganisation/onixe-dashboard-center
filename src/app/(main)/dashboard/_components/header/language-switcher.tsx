"use client";

import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/lib/i18n/i18n-context";

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 font-semibold text-muted-foreground text-xs hover:text-foreground"
          aria-label="Changer de langue / Switch language"
        >
          <Languages className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={() => setLocale("fr")}
          className={`flex cursor-pointer items-center justify-between text-xs ${
            locale === "fr" ? "font-bold text-emerald-600 dark:text-emerald-400" : ""
          }`}
        >
          <span>🇫🇷 Français</span>
          {locale === "fr" && <span className="text-emerald-600">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale("en")}
          className={`flex cursor-pointer items-center justify-between text-xs ${
            locale === "en" ? "font-bold text-emerald-600 dark:text-emerald-400" : ""
          }`}
        >
          <span>🇬🇧 English</span>
          {locale === "en" && <span className="text-emerald-600">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
