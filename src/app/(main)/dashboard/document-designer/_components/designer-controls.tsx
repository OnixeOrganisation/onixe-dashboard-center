"use client";

import { Building2, CreditCard, Lock, Palette, RefreshCcw, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { CenterBrandingSettings, FontFamily } from "../types";

interface DesignerControlsProps {
  branding: CenterBrandingSettings;
  onChange: (updated: Partial<CenterBrandingSettings>) => void;
  onReset: () => void;
  onApplyPreset: (presetName: string) => void;
}

export function DesignerControls({ branding, onChange, onReset, onApplyPreset }: DesignerControlsProps) {
  return (
    <Card className="flex h-full flex-col border-border/80 shadow-xs">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-semibold text-base">Institutional Customizer</CardTitle>
            <CardDescription className="text-xs">
              Configure center credentials, typography, stamps, and layout rules.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="size-7" onClick={onReset} title="Reset to Defaults">
            <RefreshCcw className="size-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        <Tabs defaultValue="identity" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b bg-muted/30 p-1">
            <TabsTrigger value="identity" className="gap-1.5 py-1.5 text-xs">
              <Building2 className="size-3.5" />
              Identity
            </TabsTrigger>
            <TabsTrigger value="style" className="gap-1.5 py-1.5 text-xs">
              <Palette className="size-3.5" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5 py-1.5 text-xs">
              <ShieldCheck className="size-3.5" />
              Security
            </TabsTrigger>
            <TabsTrigger value="presets" className="gap-1.5 py-1.5 text-xs">
              <Sparkles className="size-3.5" />
              Presets
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Center Identity */}
          <TabsContent value="identity" className="m-0 space-y-4 p-4">
            <div className="space-y-1.5">
              <Label htmlFor="center-name" className="text-xs">
                Organization / Campus Name
              </Label>
              <Input
                id="center-name"
                className="h-8 font-medium text-xs"
                value={branding.centerName}
                onChange={(e) => onChange({ centerName: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="center-tagline" className="text-xs">
                Accreditation Tagline & Legal Subtitle
              </Label>
              <Input
                id="center-tagline"
                className="h-8 text-xs"
                value={branding.tagline}
                onChange={(e) => onChange({ tagline: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label htmlFor="center-siret" className="text-xs">
                  SIRET Number
                </Label>
                <Input
                  id="center-siret"
                  className="h-8 font-mono text-xs"
                  value={branding.siret}
                  onChange={(e) => onChange({ siret: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="center-uai" className="text-xs">
                  UAI Code (Éducation)
                </Label>
                <Input
                  id="center-uai"
                  className="h-8 font-mono text-xs"
                  value={branding.uai}
                  onChange={(e) => onChange({ uai: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="center-qualiopi" className="text-xs">
                Qualiopi / CFA Certification Ref
              </Label>
              <Input
                id="center-qualiopi"
                className="h-8 font-mono text-xs"
                value={branding.qualiopiId}
                onChange={(e) => onChange({ qualiopiId: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="center-address" className="text-xs">
                Campus Physical Address
              </Label>
              <Input
                id="center-address"
                className="h-8 text-xs"
                value={branding.address}
                onChange={(e) => onChange({ address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label htmlFor="center-phone" className="text-xs">
                  Telephone
                </Label>
                <Input
                  id="center-phone"
                  className="h-8 text-xs"
                  value={branding.phone}
                  onChange={(e) => onChange({ phone: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="center-email" className="text-xs">
                  Official Email
                </Label>
                <Input
                  id="center-email"
                  className="h-8 text-xs"
                  value={branding.email}
                  onChange={(e) => onChange({ email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3 border-t pt-2">
              <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                <CreditCard className="size-3.5 text-primary" />
                Treasury & Settlement Accounts
              </div>
              <div className="space-y-1">
                <Label htmlFor="center-bank" className="text-xs">
                  Bank Name
                </Label>
                <Input
                  id="center-bank"
                  className="h-8 text-xs"
                  value={branding.bankName}
                  onChange={(e) => onChange({ bankName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="center-iban" className="text-xs">
                  IBAN Number
                </Label>
                <Input
                  id="center-iban"
                  className="h-8 font-mono text-xs"
                  value={branding.iban}
                  onChange={(e) => onChange({ iban: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Style & Colors */}
          <TabsContent value="style" className="m-0 space-y-4 p-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Institutional Color Palette</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ colorTheme: "navy", primaryColor: "#0f172a", accentColor: "#2563eb" })}
                  className={`flex items-center gap-2 rounded-md border p-2 text-left text-xs transition-colors ${
                    branding.colorTheme === "navy" ? "border-primary bg-primary/5 font-semibold" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="size-4 shrink-0 rounded-full border bg-[#0f172a]" />
                  <span>Onixe Navy</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ colorTheme: "emerald", primaryColor: "#064e3b", accentColor: "#059669" })}
                  className={`flex items-center gap-2 rounded-md border p-2 text-left text-xs transition-colors ${
                    branding.colorTheme === "emerald"
                      ? "border-primary bg-primary/5 font-semibold"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="size-4 shrink-0 rounded-full border bg-[#064e3b]" />
                  <span>Emerald CFA</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ colorTheme: "royal", primaryColor: "#312e81", accentColor: "#6366f1" })}
                  className={`flex items-center gap-2 rounded-md border p-2 text-left text-xs transition-colors ${
                    branding.colorTheme === "royal" ? "border-primary bg-primary/5 font-semibold" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="size-4 shrink-0 rounded-full border bg-[#312e81]" />
                  <span>Royal Indigo</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ colorTheme: "bordeaux", primaryColor: "#4c0519", accentColor: "#be123c" })}
                  className={`flex items-center gap-2 rounded-md border p-2 text-left text-xs transition-colors ${
                    branding.colorTheme === "bordeaux"
                      ? "border-primary bg-primary/5 font-semibold"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="size-4 shrink-0 rounded-full border bg-[#4c0519]" />
                  <span>Bordeaux Grand</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Typography Family</Label>
              <Select value={branding.fontFamily} onValueChange={(val) => onChange({ fontFamily: val as FontFamily })}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Font Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans">Modern Sans-Serif (Geist / Inter)</SelectItem>
                  <SelectItem value="serif">Academic Serif (Playfair / Garamond)</SelectItem>
                  <SelectItem value="mono">Technical Monospace (GeistMono)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 border-t pt-2">
              <Label htmlFor="dean-name" className="font-semibold text-xs">
                Signatory Authority
              </Label>
              <div className="space-y-1.5">
                <Input
                  id="dean-name"
                  className="h-8 text-xs"
                  placeholder="Director Full Name"
                  value={branding.deanName}
                  onChange={(e) => onChange({ deanName: e.target.value })}
                />
                <Input
                  className="h-8 text-xs"
                  placeholder="Title (e.g. Dean of Studies)"
                  value={branding.deanTitle}
                  onChange={(e) => onChange({ deanTitle: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stamp-text" className="text-xs">
                Official Center Stamp Text
              </Label>
              <Input
                id="stamp-text"
                className="h-8 font-mono text-xs uppercase"
                value={branding.stampText}
                onChange={(e) => onChange({ stampText: e.target.value })}
              />
            </div>
          </TabsContent>

          {/* TAB 3: Security & Seals */}
          <TabsContent value="security" className="m-0 space-y-3.5 p-4">
            <div className="flex items-center justify-between rounded-lg border bg-card p-2.5">
              <div className="space-y-0.5">
                <Label className="font-medium text-xs">Digital Institutional Stamp</Label>
                <p className="text-[11px] text-muted-foreground">Print official circular accreditation seal.</p>
              </div>
              <Switch checked={branding.showStamp} onCheckedChange={(checked) => onChange({ showStamp: checked })} />
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-card p-2.5">
              <div className="space-y-0.5">
                <Label className="font-medium text-xs">Blockchain QR Code Verification</Label>
                <p className="text-[11px] text-muted-foreground">Attach instant tamper-proof scan verification.</p>
              </div>
              <Switch checked={branding.showQrCode} onCheckedChange={(checked) => onChange({ showQrCode: checked })} />
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-card p-2.5">
              <div className="space-y-0.5">
                <Label className="font-medium text-xs">Security Guilloché Watermark</Label>
                <p className="text-[11px] text-muted-foreground">Subtle background anti-forgery pattern.</p>
              </div>
              <Switch
                checked={branding.showWatermark}
                onCheckedChange={(checked) => onChange({ showWatermark: checked })}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-card p-2.5">
              <div className="space-y-0.5">
                <Label className="font-medium text-xs">Digital Signature Block</Label>
                <p className="text-[11px] text-muted-foreground">Include cryptographically timestamped box.</p>
              </div>
              <Switch
                checked={branding.showSignature}
                onCheckedChange={(checked) => onChange({ showSignature: checked })}
              />
            </div>

            <div className="space-y-1.5 rounded-lg border bg-muted/40 p-3 text-muted-foreground text-xs">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Lock className="size-3.5 text-emerald-600" />
                Tamper-Proof Telemetry Engine
              </div>
              <p className="text-[11px]">
                Every generated PDF is stamped with an electronic SHA-256 hash valid for OPCO, France Compétences, and
                consular verification.
              </p>
            </div>
          </TabsContent>

          {/* TAB 4: Presets */}
          <TabsContent value="presets" className="m-0 space-y-2.5 p-4">
            <button
              type="button"
              onClick={() => onApplyPreset("french-cfa")}
              className="w-full rounded-lg border p-2.5 text-left transition-colors hover:border-primary/50 hover:bg-muted/40"
            >
              <div className="font-semibold text-foreground text-xs">French CFA & Higher Ed Accreditation</div>
              <div className="text-[11px] text-muted-foreground">
                Qualiopi standard, RNCP Level 7 headers, OPCO attendance grids, and SIRET/UAI registration.
              </div>
            </button>

            <button
              type="button"
              onClick={() => onApplyPreset("tech-institute")}
              className="w-full rounded-lg border p-2.5 text-left transition-colors hover:border-primary/50 hover:bg-muted/40"
            >
              <div className="font-semibold text-foreground text-xs">International Tech & AI Academy</div>
              <div className="text-[11px] text-muted-foreground">
                Silicon Valley inspired dark-slate borders, ECTS credit breakdowns, and blockchain hash seals.
              </div>
            </button>

            <button
              type="button"
              onClick={() => onApplyPreset("executive-school")}
              className="w-full rounded-lg border p-2.5 text-left transition-colors hover:border-primary/50 hover:bg-muted/40"
            >
              <div className="font-semibold text-foreground text-xs">Executive Business & Grand Établissement</div>
              <div className="text-[11px] text-muted-foreground">
                Classic serif typography, gold-embossed honors certificates, and prestigious parchment borders.
              </div>
            </button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
