import Image from "next/image";
import Link from "next/link";

import { AuthHeroShowcase } from "../_components/auth-hero-showcase";
import { LoginForm } from "../_components/login-form";
import { GoogleButton } from "../_components/social-auth/google-button";

export default function LoginPage() {
  return (
    <div className="flex h-dvh max-h-dvh w-full overflow-hidden bg-background">
      {/* Left Hero Showcase with Vertical Marquee Cards */}
      <div className="hidden h-full lg:flex lg:w-1/2 xl:w-7/12">
        <AuthHeroShowcase />
      </div>

      {/* Right Authentication Form Area - Fixed, No Scroll */}
      <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden p-6 sm:p-8 lg:w-1/2 xl:w-5/12">
        <div className="w-full max-w-md space-y-6">
          {/* Header & Prominent Direct Logo (No bounding box) */}
          <div className="flex flex-col items-center space-y-3 text-center">
            <Link href="/auth/login" className="transition-transform duration-200 hover:scale-105">
              <Image
                src="/images/logo-long.png"
                alt="Onixe Logo"
                width={180}
                height={48}
                className="h-10 w-auto object-contain dark:brightness-110"
                priority
              />
            </Link>

            <div className="space-y-1">
              <h1 className="font-extrabold text-2xl text-foreground tracking-tight sm:text-3xl">Sign In to Center</h1>
              <p className="mx-auto max-w-sm text-muted-foreground text-xs leading-relaxed sm:text-sm">
                Enter your administrative credentials to access your pedagogical campus and academy telemetry.
              </p>
            </div>
          </div>

          {/* Form and Google Auth */}
          <div className="space-y-3.5">
            <LoginForm />
            <div className="relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
            <GoogleButton className="w-full" variant="outline" />

            <p className="pt-1 text-center text-muted-foreground text-xs">
              Need access for your institution?{" "}
              <Link prefetch={false} href="/auth/register" className="font-semibold text-primary hover:underline">
                Register Center
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
