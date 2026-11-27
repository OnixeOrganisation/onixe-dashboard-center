"use client";

import * as React from "react";

import Image from "next/image";

interface AuthSplitLayoutProps {
  readonly children: React.ReactNode;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly headline: string;
  readonly description: string;
}

export function AuthSplitLayout({ children, imageSrc, imageAlt, headline, description }: AuthSplitLayoutProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [headlineCount, setHeadlineCount] = React.useState(0);
  const [descriptionCount, setDescriptionCount] = React.useState(0);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHeadlineCount(headline.length);
      setDescriptionCount(description.length);
      return;
    }

    setHeadlineCount(0);
    setDescriptionCount(0);

    let rafId = 0;
    const startDelayMs = 250;
    const headlineCharMs = 24;
    const pauseBetweenMs = 150;
    const descriptionCharMs = 14;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime - startDelayMs;
      if (elapsed > 0) {
        const nextHeadlineCount = Math.min(headline.length, Math.floor(elapsed / headlineCharMs));
        setHeadlineCount(nextHeadlineCount);

        const headlineDuration = headline.length * headlineCharMs;
        const descElapsed = elapsed - headlineDuration - pauseBetweenMs;
        if (descElapsed > 0) {
          const nextDescCount = Math.min(description.length, Math.floor(descElapsed / descriptionCharMs));
          setDescriptionCount(nextDescCount);

          if (nextHeadlineCount >= headline.length && nextDescCount >= description.length) {
            return;
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [headline, description]);

  const isTypingHeadline = headlineCount < headline.length;
  const isTypingDescription = !isTypingHeadline && descriptionCount < description.length;

  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        {/* Colonne Visuelle (Droite sur Desktop) */}
        <div className="relative order-2 hidden h-full overflow-hidden rounded-3xl bg-muted lg:flex">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={`object-cover transition-all duration-1000 ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
              isVisible ? "scale-100 opacity-100" : "scale-105 opacity-90"
            }`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-slate-950/35" />

          <div
            className={`absolute top-10 left-10 flex flex-col gap-1.5 text-white transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
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
            <div className="relative">
              <div className="invisible font-semibold text-2xl leading-snug" aria-hidden="true">
                {headline}
              </div>
              <h2 className="absolute inset-0 font-semibold text-2xl leading-snug">
                {headline.slice(0, headlineCount)}
                {isTypingHeadline && (
                  <span className="ml-0.5 inline-block h-[0.95em] w-0.5 animate-pulse bg-white/90 align-middle" />
                )}
              </h2>
            </div>

            <div className="relative">
              <p className="invisible text-sm text-white/80" aria-hidden="true">
                {description}
              </p>
              <p className="absolute inset-0 text-sm text-white/80">
                {description.slice(0, descriptionCount)}
                {isTypingDescription && (
                  <span className="ml-0.5 inline-block h-[0.95em] w-0.5 animate-pulse bg-white/80 align-middle" />
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Colonne Formulaire (Gauche sur Desktop) */}
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
