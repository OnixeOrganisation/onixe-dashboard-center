"use client";

import * as React from "react";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Languages,
  Monitor,
  Moon,
  Palette,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { THEME_PRESET_OPTIONS, type ThemeMode, type ThemePreset } from "@/lib/preferences/theme";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

const ONBOARDING_STORAGE_KEY = "onixe_center_onboarded_v1";
const CENTER_NAME_STORAGE_KEY = "onixe_center_custom_name";

export function OnboardingDialog() {
  const { locale, setLocale, t } = useTranslation();
  const { themeMode, themePreset, setPreference } = usePreferencesStore(
    useShallow((s) => ({
      themeMode: s.values.theme_mode,
      themePreset: s.values.theme_preset,
      setPreference: s.setPreference,
    })),
  );

  const [isOpen, setIsOpen] = React.useState(false);
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [centerName, setCenterName] = React.useState("Onixe Training Center");
  const [primaryDept, setPrimaryDept] = React.useState("Computer Science & Engineering");

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const hasOnboarded = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!hasOnboarded) {
      // Delay opening slightly to avoid hydration flash
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSelectLanguage = (lang: "fr" | "en") => {
    setLocale(lang);
  };

  const handleSelectThemeMode = (mode: ThemeMode) => {
    setPreference("theme_mode", mode);
  };

  const handleSelectThemePreset = (preset: ThemePreset) => {
    setPreference("theme_preset", preset);
  };

  const handleCompleteOnboarding = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
      if (centerName.trim()) {
        localStorage.setItem(CENTER_NAME_STORAGE_KEY, centerName.trim());
      }
    }

    setIsOpen(false);
    toast.success(t("onboarding.successNotice", "Espace configuré avec succès ! Bienvenue sur Onixe."), {
      description: `${centerName} (${locale === "fr" ? "Français" : "English"})`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl gap-0 p-0 overflow-hidden border-border/80 shadow-2xl">
        {/* Top Header Banner */}
        <div className="relative bg-muted/40 p-6 border-b">
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary gap-1.5 px-3 py-1 font-medium"
            >
              <span>{t("onboarding.badge", "Configuration Initiale")}</span>
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span
                className={`px-2 py-0.5 rounded-full ${step === 1 ? "bg-primary text-primary-foreground font-semibold" : "bg-muted"}`}
              >
                1
              </span>
              <span className="text-muted-foreground/40">/</span>
              <span
                className={`px-2 py-0.5 rounded-full ${step === 2 ? "bg-primary text-primary-foreground font-semibold" : "bg-muted"}`}
              >
                2
              </span>
              <span className="text-muted-foreground/40">/</span>
              <span
                className={`px-2 py-0.5 rounded-full ${step === 3 ? "bg-primary text-primary-foreground font-semibold" : "bg-muted"}`}
              >
                3
              </span>
            </div>
          </div>

          <DialogTitle className="text-xl font-bold tracking-tight">
            {t("onboarding.title", "Bienvenue sur Onixe Center")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {t(
              "onboarding.subtitle",
              "Configurez les paramètres fondamentaux de votre espace de formation pour démarrer.",
            )}
          </DialogDescription>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-6">
          {/* STEP 1: LANGUAGE SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Languages className="size-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t("onboarding.stepLanguage", "Langue de base")}</h4>
                  <p className="text-muted-foreground text-xs">
                    {t(
                      "onboarding.languagePrompt",
                      "Choisissez la langue principale de votre tableau de bord et de vos documents :",
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* French Option */}
                <button
                  type="button"
                  onClick={() => handleSelectLanguage("fr")}
                  className={`flex flex-col justify-between p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                    locale === "fr"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-muted/70 hover:border-primary/40 bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 w-full">
                    <span className="font-semibold text-base">{t("onboarding.langFr", "Français")}</span>
                    {locale === "fr" && (
                      <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("onboarding.langFrDesc", "Interface, attestations d'assiduité et notifications en français.")}
                  </p>
                </button>

                {/* English Option */}
                <button
                  type="button"
                  onClick={() => handleSelectLanguage("en")}
                  className={`flex flex-col justify-between p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                    locale === "en"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-muted/70 hover:border-primary/40 bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 w-full">
                    <span className="font-semibold text-base">{t("onboarding.langEn", "English")}</span>
                    {locale === "en" && (
                      <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("onboarding.langEnDesc", "Full dashboard UI, certificates and notifications in English.")}
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: THEME & COLOR PRESET */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Palette className="size-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t("onboarding.stepTheme", "Thème & Ambiance")}</h4>
                  <p className="text-muted-foreground text-xs">
                    {t("onboarding.themePrompt", "Personnalisez l'ambiance visuelle et le mode d'affichage :")}
                  </p>
                </div>
              </div>

              {/* Theme Mode Buttons */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Mode d'affichage</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={themeMode === "light" ? "default" : "outline"}
                    size="sm"
                    className="justify-center gap-2"
                    onClick={() => handleSelectThemeMode("light")}
                  >
                    <Sun className="size-4" />
                    <span>{t("onboarding.modeLight", "Clair")}</span>
                  </Button>
                  <Button
                    type="button"
                    variant={themeMode === "dark" ? "default" : "outline"}
                    size="sm"
                    className="justify-center gap-2"
                    onClick={() => handleSelectThemeMode("dark")}
                  >
                    <Moon className="size-4" />
                    <span>{t("onboarding.modeDark", "Sombre")}</span>
                  </Button>
                  <Button
                    type="button"
                    variant={themeMode === "system" ? "default" : "outline"}
                    size="sm"
                    className="justify-center gap-2"
                    onClick={() => handleSelectThemeMode("system")}
                  >
                    <Monitor className="size-4" />
                    <span>{t("onboarding.modeSystem", "Système")}</span>
                  </Button>
                </div>
              </div>

              {/* Preset Palette Options */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("onboarding.presetLabel", "Palette de couleurs de l'institution")}
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {THEME_PRESET_OPTIONS.map((preset) => {
                    const isSelected = themePreset === preset.value;
                    return (
                      <button
                        type="button"
                        key={preset.value}
                        onClick={() => handleSelectThemePreset(preset.value)}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer w-full text-left ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-xs"
                            : "border-muted/70 hover:border-primary/40 bg-card"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="size-4 rounded-full border border-black/10 dark:border-white/20 shrink-0"
                            style={{ backgroundColor: preset.primary.light }}
                          />
                          <span className="text-xs font-medium">{preset.label}</span>
                        </div>
                        {isSelected && <Check className="size-3.5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INSTITUTION & CONFIRMATION */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t("onboarding.stepInstitution", "Établissement")}</h4>
                  <p className="text-muted-foreground text-xs">
                    Identité institutionnelle de votre centre de formation.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="center-name" className="text-xs font-medium">
                    {t("onboarding.instNameLabel", "Nom de l'établissement ou centre")}
                  </Label>
                  <Input
                    id="center-name"
                    value={centerName}
                    onChange={(e) => setCenterName(e.target.value)}
                    placeholder={t("onboarding.instNamePlaceholder", "Ex: Institut Polytechnique d'Excellence")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="primary-dept" className="text-xs font-medium">
                    {t("onboarding.deptLabel", "Département ou filière phare")}
                  </Label>
                  <Input
                    id="primary-dept"
                    value={primaryDept}
                    onChange={(e) => setPrimaryDept(e.target.value)}
                    placeholder={t("onboarding.deptPlaceholder", "Ex: Informatique & Systèmes")}
                  />
                </div>

                {/* Recap Card */}
                <div className="rounded-xl border bg-muted/30 p-3.5 space-y-2 text-xs mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Langue choisie :</span>
                    <span className="font-semibold">{locale === "fr" ? "Français" : "English"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Mode d'affichage :</span>
                    <span className="font-semibold capitalize">{themeMode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Nuancier actif :</span>
                    <span className="font-semibold capitalize">{themePreset}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <DialogFooter className="border-t bg-muted/20 px-6 py-4 flex flex-row items-center justify-between sm:justify-between">
          <div>
            {step > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="gap-1.5"
              >
                <ArrowLeft className="size-3.5" />
                <span>{t("common.back", "Retour")}</span>
              </Button>
            ) : (
              <div />
            )}
          </div>

          <div>
            {step < 3 ? (
              <Button size="sm" onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)} className="gap-1.5">
                <span>{t("common.confirm", "Continuer")}</span>
                <ArrowRight className="size-3.5" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleCompleteOnboarding} className="gap-2">
                <CheckCircle2 className="size-4" />
                <span>{t("onboarding.finishButton", "Enregistrer & Accéder à l'espace")}</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
