import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "../../_components/login-form";
import { GoogleButton } from "../../_components/social-auth/google-button";

export default function LoginV1() {
  return (
    <div className="flex h-dvh">
      <div className="hidden bg-primary lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-4">
            <h1 className="font-semibold text-3xl text-primary-foreground tracking-tight">Onixe Centre</h1>
            <p className="mx-auto max-w-xs text-primary-foreground/90 text-sm">
              Pedagogical Operating System for Training Organizations
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-8 py-16 lg:py-24">
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#27272A] bg-black p-2.5 shadow-lg">
              <Image src="/images/logo-court.png" alt="Onixe Logo" width={40} height={40} className="object-contain" />
            </div>
            <div className="space-y-1">
              <h2 className="font-bold text-2xl text-foreground tracking-tight">Sign In to Dashboard</h2>
              <p className="mx-auto max-w-sm text-muted-foreground text-sm">
                Enter your center administrator credentials to access your academy dashboard.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <LoginForm />
            <GoogleButton className="w-full" variant="outline" />
            <p className="text-center text-muted-foreground text-xs">
              Need access for your institution?{" "}
              <Link prefetch={false} href="/auth/v1/register" className="font-medium text-primary hover:underline">
                Contact Administration
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
