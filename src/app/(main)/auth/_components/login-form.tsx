"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import { sendLoginOtpApi, verifyLoginOtpApi, type SendLoginOtpData } from "./auth.api";

export function LoginForm() {
  const router = useRouter();

  const [step, setStep] = React.useState<"email" | "otp">("email");
  const [email, setEmail] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [otpCode, setOtpCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);
  const [devCode, setDevCode] = React.useState<string | null>(null);
  const [userProfile, setUserProfile] = React.useState<SendLoginOtpData["user"] | null>(null);

  // Restore remembered email on mount
  React.useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("onixe_remembered_email");
      if (savedEmail) {
        setEmail(savedEmail);
      }
    } catch {
      // Ignored if localStorage is unavailable
    }
  }, []);

  // Cooldown timer countdown
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      toast.error("Format d'adresse invalide", {
        description: "Veuillez renseigner une adresse e-mail institutionnelle valide.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendLoginOtpApi({
        email: trimmedEmail,
        lang: "fr",
      });

      if (remember) {
        localStorage.setItem("onixe_remembered_email", trimmedEmail);
      } else {
        localStorage.removeItem("onixe_remembered_email");
      }

      setUserProfile(res.user || null);
      if (res.devCode) {
        setDevCode(res.devCode);
      }
      setCooldown(res.cooldownSeconds || 60);
      setStep("otp");
      setOtpCode("");

      toast.success("Code de sécurité envoyé", {
        description: `Un code à 6 chiffres a été transmis à ${trimmedEmail}.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error("Échec de l'envoi du code", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      const res = await sendLoginOtpApi({
        email: email.trim().toLowerCase(),
        lang: "fr",
      });
      if (res.devCode) {
        setDevCode(res.devCode);
      }
      setCooldown(res.cooldownSeconds || 60);
      toast.success("Nouveau code transmis", {
        description: `Un nouveau code à 6 chiffres a été envoyé à ${email}.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error("Impossible de renvoyer le code", {
        description: message,
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const finalCode = (codeToVerify || otpCode).trim();
    if (finalCode.length !== 6) {
      toast.error("Code incomplet", {
        description: "Veuillez saisir l'intégralité des 6 chiffres reçus par e-mail.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyLoginOtpApi({
        email: email.trim().toLowerCase(),
        code: finalCode,
        lang: "fr",
      });

      try {
        localStorage.setItem("onixe_auth_token", res.token);
        localStorage.setItem("onixe_auth_user", JSON.stringify(res.user));
      } catch {
        // Continue even if storage fails
      }

      toast.success("Authentification réussie", {
        description: `Bienvenue ${res.user.name}. Accès au centre en cours...`,
      });

      router.push("/dashboard/academy");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error("Code invalide ou expiré", {
        description: message,
      });
      setOtpCode("");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <div className="flex flex-col gap-4">
        {/* Identified User Badge */}
        {userProfile && (
          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
            <Avatar className="size-10 rounded-md">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback className="rounded-md font-semibold text-xs">
                {(userProfile.name || "U").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-foreground text-sm">{userProfile.name}</span>
              <span className="text-muted-foreground text-xs">{userProfile.role || "Centre & Académie"}</span>
            </div>
            <div className="ml-auto flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-3.5" />
              <span>Vérifié</span>
            </div>
          </div>
        )}

        <div className="rounded-lg border bg-card p-4 text-center space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-foreground font-semibold text-sm">
              <KeyRound className="size-4 text-primary" />
              <span>Saisir le code de sécurité</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Vérifiez votre boîte de réception à <strong className="text-foreground">{email}</strong>
            </p>
          </div>

          {/* 6-Digit OTP Field */}
          <div className="flex justify-center py-2">
            <InputOTP
              maxLength={6}
              value={otpCode}
              onChange={(value) => {
                setOtpCode(value);
                if (value.length === 6) {
                  void handleVerifyOtp(value);
                }
              }}
              disabled={isLoading}
            >
              <InputOTPGroup className="gap-1.5 sm:gap-2">
                <InputOTPSlot index={0} className="size-10 sm:size-11 font-bold text-base rounded-md border" />
                <InputOTPSlot index={1} className="size-10 sm:size-11 font-bold text-base rounded-md border" />
                <InputOTPSlot index={2} className="size-10 sm:size-11 font-bold text-base rounded-md border" />
                <InputOTPSlot index={3} className="size-10 sm:size-11 font-bold text-base rounded-md border" />
                <InputOTPSlot index={4} className="size-10 sm:size-11 font-bold text-base rounded-md border" />
                <InputOTPSlot index={5} className="size-10 sm:size-11 font-bold text-base rounded-md border" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Test Code Helper for Local Dev */}
          {devCode && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/40 bg-primary/5 px-3 py-1 text-[11px] text-muted-foreground">
              <span>Code de démonstration généré :</span>
              <strong className="font-mono text-primary font-bold">{devCode}</strong>
            </div>
          )}

          {/* Validation Button */}
          <Button
            type="button"
            className="w-full gap-2"
            disabled={isLoading || otpCode.length !== 6}
            onClick={() => handleVerifyOtp()}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
            Confirmer et se connecter
          </Button>

          {/* Actions & Resend */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtpCode("");
              }}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3" />
              Modifier l&apos;adresse
            </button>

            {cooldown > 0 ? (
              <span className="text-muted-foreground text-[11px]">Renvoyer dans {cooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="flex items-center gap-1 text-primary hover:underline font-medium"
              >
                <RefreshCw className={`size-3 ${isResending ? "animate-spin" : ""}`} />
                Renvoyer le code
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSendOtp} className="flex flex-col gap-4">
      <FieldGroup className="gap-4">
        <Field className="gap-1.5">
          <FieldLabel htmlFor="login-email">Adresse e-mail institutionnelle</FieldLabel>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@onixe.institute"
              autoComplete="email"
              disabled={isLoading}
              className="pl-9"
              required
            />
          </div>
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            id="login-remember"
            checked={remember}
            onCheckedChange={(checked) => setRemember(Boolean(checked))}
            disabled={isLoading}
          />
          <FieldContent>
            <FieldLabel htmlFor="login-remember" className="font-normal text-xs text-muted-foreground">
              Mémoriser mon adresse e-mail sur ce terminal
            </FieldLabel>
          </FieldContent>
        </Field>
      </FieldGroup>

      <Button className="w-full gap-2" type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
        Envoyer le code de sécurité
      </Button>
    </form>
  );
}
