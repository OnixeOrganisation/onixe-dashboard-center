import Image from "next/image";
import Link from "next/link";

import { RegisterForm } from "../_components/register-form";
import { GoogleButton } from "../_components/social-auth/google-button";

export default function RegisterPage() {
  return (
    <div className="flex h-dvh max-h-dvh w-full overflow-hidden bg-background">
      {/* Left Cover Image */}
      <div className="relative hidden h-full lg:block lg:w-1/2 xl:w-7/12">
        <Image
          src="/images/register-panel.jpg"
          alt="Onixe Campus Center"
          fill
          priority
          sizes="(min-width: 1280px) 58vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20 pointer-events-none" />
      </div>

      {/* Right Authentication Form Area */}
      <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto p-6 sm:p-8 lg:w-1/2 xl:w-5/12">
        <div className="w-full max-w-md space-y-6">
          {/* Header & Prominent Onixe Logo */}
          <div className="flex flex-col items-center space-y-3 text-center">
            <Link href="/auth/register" className="transition-transform duration-200 hover:scale-105">
              <Image
                src="/images/logo-long.png"
                alt="Onixe Logo"
                width={260}
                height={88}
                className="h-12 sm:h-14 w-auto object-contain dark:brightness-110 drop-shadow-sm"
                priority
              />
            </Link>

            <div className="space-y-1">
              <h1 className="font-extrabold text-2xl text-foreground tracking-tight sm:text-3xl">
                Register Training Center
              </h1>
              <p className="mx-auto max-w-sm text-muted-foreground text-xs leading-relaxed sm:text-sm">
                Deploy your institution workspace with automated attendance, gradebook deliberation, and OPCO billing.
              </p>
            </div>
          </div>

          {/* Form and Google Auth */}
          <div className="space-y-3.5">
            <RegisterForm />
            <div className="relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
            <GoogleButton className="w-full" variant="outline" />

            <p className="pt-1 text-center text-muted-foreground text-xs">
              Already have an account?{" "}
              <Link prefetch={false} href="/auth/login" className="font-semibold text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
