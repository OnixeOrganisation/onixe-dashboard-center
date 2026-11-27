import Link from "next/link";

import { Globe } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";

import { AuthSplitLayout } from "../_components/auth-split-layout";
import { LoginForm } from "../_components/login-form";
import { GoogleButton } from "../_components/social-auth/google-button";

export default function LoginPage() {
  return (
    <AuthSplitLayout
      imageSrc="/images/login-cover.jpg"
      imageAlt="Campus Onixe Centre"
      headline="Pilotez votre établissement, vos cohortes et la performance pédagogique."
      description="Centralisez la gestion des apprenants, formateurs, emplois du temps, évaluations et certifications depuis un cockpit unique."
    >
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[370px] sm:px-0">
        <div className="space-y-2 text-center">
          <h1 className="font-medium text-3xl text-foreground tracking-tight">Connexion Centre</h1>
          <p className="mx-auto max-w-sm text-muted-foreground text-sm">
            Recevez un code de vérification unique sur votre adresse e-mail institutionnelle.
          </p>
        </div>

        <div className="space-y-4">
          <GoogleButton className="w-full" variant="outline" />
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">Ou continuer avec</span>
          </div>
          <LoginForm />
        </div>
      </div>

      <div className="absolute top-5 flex w-full justify-end px-10">
        <div className="text-muted-foreground text-sm">
          Pas encore de compte ?{" "}
          <Link prefetch={false} className="text-foreground hover:underline" href="/auth/register">
            Créer un compte
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
    </AuthSplitLayout>
  );
}
