import Image from "next/image";
import Link from "next/link";

import { Globe } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";

import { RegisterForm } from "../_components/register-form";
import { GoogleButton } from "../_components/social-auth/google-button";

export default function RegisterPage() {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        {/* Colonne Visuelle (Droite sur Desktop) */}
        <div className="relative order-2 hidden h-full overflow-hidden rounded-3xl bg-muted lg:flex">
          <Image
            src="/images/register-panel.jpg"
            alt="Campus Onixe Centre"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-slate-950/35" />

          <div className="absolute top-10 left-10 flex flex-col gap-1.5 text-white">
            <Image
              src="/images/logo-long.png"
              alt="Logo Onixe"
              width={200}
              height={68}
              className="h-10 w-auto object-contain object-left"
              priority
            />
            <p className="text-white/80 text-xs">Espace Centre de Formation &amp; Administration</p>
          </div>

          <div className="absolute right-10 bottom-10 left-10 space-y-2 text-white">
            <h2 className="font-semibold text-2xl leading-snug">
              Déployez votre établissement sur Onixe Centre en quelques minutes.
            </h2>
            <p className="text-sm text-white/80">
              Automatisez l&apos;émargement, le suivi des cohortes, les bulletins et la facturation OPCO depuis une
              plateforme unifiée.
            </p>
          </div>
        </div>

        {/* Colonne Formulaire (Gauche sur Desktop) */}
        <div className="relative order-1 flex h-full">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[370px] sm:px-0">
            <div className="space-y-2 text-center">
              <h1 className="font-medium text-3xl text-foreground tracking-tight">Créer un compte Centre</h1>
              <p className="mx-auto max-w-sm text-muted-foreground text-sm">
                Renseignez les informations de votre établissement pour démarrer.
              </p>
            </div>

            <div className="space-y-4">
              <GoogleButton className="w-full" variant="outline" />
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">Ou continuer avec</span>
              </div>
              <RegisterForm />
            </div>
          </div>

          <div className="absolute top-5 flex w-full justify-end px-10">
            <div className="text-muted-foreground text-sm">
              Vous avez déjà un compte ?{" "}
              <Link prefetch={false} className="text-foreground hover:underline" href="/auth/login">
                Se connecter
              </Link>
            </div>
          </div>

          <div className="absolute bottom-5 flex w-full justify-between px-10">
            <div className="text-sm">{APP_CONFIG.copyright}</div>
            <div className="flex items-center gap-1 text-sm">
              <Globe className="size-4 text-muted-foreground" />
              FR
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
