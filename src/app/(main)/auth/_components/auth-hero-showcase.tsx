"use client";

import {
  Award,
  CalendarCheck,
  CheckCircle2,
  GraduationCap,
  QrCode,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface VerticalShowcaseCard {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  gradient: string;
  accentBorder: string;
  statLabel: string;
  statValue: string;
  metricBadge: string;
  previewGraphic: React.ReactNode;
}

const SHOWCASE_CARDS_COL_A: VerticalShowcaseCard[] = [
  {
    id: "card-attendance",
    category: "Assiduité & Émargement",
    title: "Feuille de Présence Digitale",
    subtitle: "Émargement par QR Code sécurisé & horodatage cryptographique SHA-256.",
    badge: "OPCO Conforme",
    icon: <QrCode className="size-4 text-emerald-400" />,
    gradient: "from-emerald-950/60 via-slate-900 to-slate-950",
    accentBorder: "border-emerald-500/30 group-hover:border-emerald-500/60",
    statLabel: "Taux de présence validé",
    statValue: "98.6%",
    metricBadge: "35h / 35h Certifiées",
    previewGraphic: (
      <div className="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-slate-300">Session Microservices (NestJS)</span>
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/20 text-[9px] text-emerald-300">
            Signé à 09:02
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded bg-emerald-500/20 text-emerald-400">
            <QrCode className="size-4" />
          </div>
          <div className="flex-1 font-mono text-[9px] text-slate-400">
            <div>SHA256: 8f4e2...a91c</div>
            <div className="text-emerald-400">Empreinte légale vérifiée</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "card-grades",
    category: "Délibération & ECTS",
    title: "Relevé & Carnet de Notes",
    subtitle: "Calcul automatique des moyennes pondérées et mentions du jury d'examen.",
    badge: "RNCP Niveau 7",
    icon: <Award className="size-4 text-purple-400" />,
    gradient: "from-purple-950/60 via-slate-900 to-slate-950",
    accentBorder: "border-purple-500/30 group-hover:border-purple-500/60",
    statLabel: "Moyenne générale de promotion",
    statValue: "16.8 / 20",
    metricBadge: "60 Crédits ECTS",
    previewGraphic: (
      <div className="space-y-1.5 rounded-xl border border-purple-500/20 bg-purple-950/30 p-3 text-[10px]">
        <div className="flex justify-between border-purple-500/20 border-b pb-1">
          <span className="text-slate-300">Architecture Cloud & Kubernetes</span>
          <span className="font-bold text-purple-300">17.5 / 20</span>
        </div>
        <div className="flex justify-between border-purple-500/20 border-b pb-1">
          <span className="text-slate-300">Event-Driven Architecture (RabbitMQ)</span>
          <span className="font-bold text-purple-300">16.0 / 20</span>
        </div>
        <div className="flex items-center justify-between pt-0.5 font-semibold text-emerald-400">
          <span>Verdict Délibération</span>
          <span>Admis • Félicitations</span>
        </div>
      </div>
    ),
  },
  {
    id: "card-billing",
    category: "Finance & CFA",
    title: "Facturation Entreprises & OPCO",
    subtitle: "Génération par lots des échéanciers et factures de prise en charge.",
    badge: "Réconciliation 100%",
    icon: <Receipt className="size-4 text-sky-400" />,
    gradient: "from-sky-950/60 via-slate-900 to-slate-950",
    accentBorder: "border-sky-500/30 group-hover:border-sky-500/60",
    statLabel: "Volume facturé ce semestre",
    statValue: "348,500 €",
    metricBadge: "0 Échéance en retard",
    previewGraphic: (
      <div className="space-y-2 rounded-xl border border-sky-500/20 bg-sky-950/30 p-3 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Contrat Atlas OPCO #2024-81</span>
          <span className="font-bold text-sky-300">9,500.00 €</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-full bg-gradient-to-r from-sky-500 to-emerald-400" />
        </div>
        <div className="flex justify-between text-[9px] text-slate-400">
          <span>Prise en charge intégrale</span>
          <span className="font-semibold text-emerald-400">Payé (Virement SEPA)</span>
        </div>
      </div>
    ),
  },
];

const SHOWCASE_CARDS_COL_B: VerticalShowcaseCard[] = [
  {
    id: "card-qualiopi",
    category: "Qualité & Audit",
    title: "Référentiel National Qualiopi",
    subtitle: "Suivi continu des indicateurs 21 & 22 et archivage légal des compétences.",
    badge: "Conforme 100%",
    icon: <ShieldCheck className="size-4 text-amber-400" />,
    gradient: "from-amber-950/60 via-slate-900 to-slate-950",
    accentBorder: "border-amber-500/30 group-hover:border-amber-500/60",
    statLabel: "Indicateurs audités",
    statValue: "32 / 32",
    metricBadge: "Zéro non-conformité",
    previewGraphic: (
      <div className="space-y-1.5 rounded-xl border border-amber-500/20 bg-amber-950/30 p-3 text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-200">
          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400" />
          <span>Indicateur 21 : Qualification continue formateurs</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-200">
          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400" />
          <span>Indicateur 22 : Ressources & environnements cloud LMS</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-200">
          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400" />
          <span>Indicateur 26 : Référent handicap & accessibilité PSH</span>
        </div>
      </div>
    ),
  },
  {
    id: "card-planning",
    category: "Campus & Salles",
    title: "Solveur d'Emplois du Temps",
    subtitle: "Allocation heuristique des amphithéâtres, laboratoires et disponibilités.",
    badge: "0 Conflit",
    icon: <CalendarCheck className="size-4 text-indigo-400" />,
    gradient: "from-indigo-950/60 via-slate-900 to-slate-950",
    accentBorder: "border-indigo-500/30 group-hover:border-indigo-500/60",
    statLabel: "Capacité globale d'accueil",
    statValue: "1,240 places",
    metricBadge: "13 Salles synchronisées",
    previewGraphic: (
      <div className="space-y-2 rounded-xl border border-indigo-500/20 bg-indigo-950/30 p-3 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Amphi Turing • 180 Places</span>
          <Badge variant="outline" className="border-indigo-400/40 bg-indigo-500/20 text-[9px] text-indigo-300">
            Occupé 100%
          </Badge>
        </div>
        <div className="grid grid-cols-4 gap-1 text-center font-mono text-[9px]">
          <div className="rounded bg-indigo-900/60 p-1 text-indigo-200">08h-10h</div>
          <div className="rounded bg-indigo-900/60 p-1 text-indigo-200">10h-12h</div>
          <div className="rounded bg-indigo-900/60 p-1 text-indigo-200">14h-16h</div>
          <div className="rounded bg-indigo-900/60 p-1 text-indigo-200">16h-18h</div>
        </div>
      </div>
    ),
  },
  {
    id: "card-ai",
    category: "IA Pédagogique",
    title: "Générateur de Syllabus RNCP",
    subtitle: "Synthèse de parcours de formation, compétences et remédiation prédictive.",
    badge: "Copilot v2.4",
    icon: <Sparkles className="size-4 text-rose-400" />,
    gradient: "from-rose-950/60 via-slate-900 to-slate-950",
    accentBorder: "border-rose-500/30 group-hover:border-rose-500/60",
    statLabel: "Volume de formation généré",
    statValue: "48 Heures",
    metricBadge: "Diagnostic de décrochage",
    previewGraphic: (
      <div className="space-y-1.5 rounded-xl border border-rose-500/20 bg-rose-950/30 p-3 text-[10px]">
        <div className="flex items-center gap-1.5 font-semibold text-rose-300">
          <Sparkles className="size-3" />
          <span>Prompt: Curriculum Microservices Master</span>
        </div>
        <p className="line-clamp-2 text-[9px] text-slate-300 leading-snug">
          4 Modules générés : Clean Architecture, Hexagonal Domain, Event Bus RabbitMQ & Observability.
        </p>
      </div>
    ),
  },
];

function VerticalCardItem({ card }: { card: VerticalShowcaseCard }) {
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-b ${card.gradient} p-4 shadow-xl backdrop-blur-md transition-all duration-300 ${card.accentBorder} min-h-[290px]`}
    >
      {/* Top row */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              {card.icon}
            </div>
            <span className="font-semibold text-[11px] text-slate-300 uppercase tracking-wider">{card.category}</span>
          </div>

          <Badge variant="outline" className="border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-slate-200">
            {card.badge}
          </Badge>
        </div>

        <div className="mt-3">
          <h4 className="font-bold text-slate-100 text-sm tracking-tight">{card.title}</h4>
          <p className="mt-1 text-slate-400 text-xs leading-relaxed">{card.subtitle}</p>
        </div>
      </div>

      {/* Middle Interactive Mockup Graphic */}
      <div className="my-2">{card.previewGraphic}</div>

      {/* Bottom KPI row */}
      <div className="flex items-center justify-between border-white/5 border-t pt-2.5">
        <div>
          <div className="text-[10px] text-slate-400">{card.statLabel}</div>
          <div className="font-black text-slate-100 text-sm tracking-tight">{card.statValue}</div>
        </div>
        <div className="text-right font-medium text-[10px] text-emerald-400">{card.metricBadge}</div>
      </div>
    </div>
  );
}

export function AuthHeroShowcase() {
  const listA = [
    ...SHOWCASE_CARDS_COL_A.map((c) => ({ ...c, loopKey: `loop-1-${c.id}` })),
    ...SHOWCASE_CARDS_COL_A.map((c) => ({ ...c, loopKey: `loop-2-${c.id}` })),
  ];
  const listB = [
    ...SHOWCASE_CARDS_COL_B.map((c) => ({ ...c, loopKey: `loop-1-${c.id}` })),
    ...SHOWCASE_CARDS_COL_B.map((c) => ({ ...c, loopKey: `loop-2-${c.id}` })),
  ];

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary/90 p-6 lg:p-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-indigo-600/20 blur-3xl" />

      {/* Top Gradient Fade Mask */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-20 bg-gradient-to-b from-slate-950 via-slate-950/60 to-transparent" />

      {/* Vertical Animated Marquee Columns */}
      <div className="relative grid flex-1 grid-cols-2 gap-3.5 overflow-hidden py-2">
        {/* Column A */}
        <div className="flex animate-marquee-vertical flex-col gap-3.5">
          {listA.map((card) => (
            <VerticalCardItem key={card.loopKey} card={card} />
          ))}
        </div>

        {/* Column B */}
        <div className="flex animate-marquee-vertical-slow flex-col gap-3.5">
          {listB.map((card) => (
            <VerticalCardItem key={card.loopKey} card={card} />
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade Mask */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-40 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />

      {/* Bottom Institutional Info Overlay */}
      <div className="relative z-20 mt-1 space-y-2 rounded-2xl border border-white/10 bg-slate-950/85 p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="size-4" />
          </div>
          <h2 className="font-extrabold text-base text-white tracking-tight">Onixe Center</h2>
          <Badge variant="outline" className="ml-auto border-white/20 bg-white/5 text-[9px] text-slate-300">
            Enterprise OS
          </Badge>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed">
          Système d&apos;exploitation pédagogique et administratif complet pour CFA, centres de formation et
          établissements d&apos;enseignement supérieur.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <div className="flex items-center gap-1 font-medium text-[10px] text-emerald-400">
            <CheckCircle2 className="size-3" />
            <span>Multi-Tenant</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1 font-medium text-[10px] text-emerald-400">
            <CheckCircle2 className="size-3" />
            <span>Qualiopi & OPCO Ready</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1 font-medium text-[10px] text-emerald-400">
            <CheckCircle2 className="size-3" />
            <span>ECTS & RNCP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
