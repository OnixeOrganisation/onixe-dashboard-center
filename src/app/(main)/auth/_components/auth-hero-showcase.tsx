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

interface ShowcaseCard {
  id: string;
  icon: React.ReactNode;
  category: string;
  badge: string;
  badgeVariant?: "default" | "outline" | "secondary";
  title: string;
  description: string;
  statLabel: string;
  statValue: string;
  extraMeta: string;
}

const SHOWCASE_CARDS_COL_A: ShowcaseCard[] = [
  {
    id: "card-attendance",
    icon: <QrCode className="size-4 text-emerald-400" />,
    category: "Assiduité & Émargement",
    badge: "Signé SHA-256",
    title: "Émargement Digital & QR Sécurisé",
    description: "Feuilles de présence certifiées pour contrôle OPCO et financeurs.",
    statLabel: "Taux d'assiduité cohortes",
    statValue: "98.4%",
    extraMeta: "35h / 35h validées cette semaine",
  },
  {
    id: "card-grades",
    icon: <Award className="size-4 text-purple-400" />,
    category: "Carnet de Notes & ECTS",
    badge: "Admis • Mention TB",
    title: "Délibération du Jury Académique",
    description: "Relevé officiel avec coefficients, crédits ECTS et mentions validées.",
    statLabel: "Moyenne générale de promo",
    statValue: "16.8 / 20",
    extraMeta: "60 Crédits ECTS certifiés",
  },
  {
    id: "card-billing",
    icon: <Receipt className="size-4 text-sky-400" />,
    category: "Facturation CFA & OPCO",
    badge: "Réconcilié",
    title: "Contrats d'Apprentissage & Prise en Charge",
    description: "Génération groupée des échéances et factures entreprises partenaires.",
    statLabel: "Volume facturé ce semestre",
    statValue: "348,500 €",
    extraMeta: "100% conformité tiers payeurs",
  },
];

const SHOWCASE_CARDS_COL_B: ShowcaseCard[] = [
  {
    id: "card-qualiopi",
    icon: <ShieldCheck className="size-4 text-amber-400" />,
    category: "Audit & Qualité",
    badge: "Conforme 100%",
    title: "Conformité Référentiel Qualiopi",
    description: "Audit continu des critères 21 & 22 et archivage légal des preuves.",
    statLabel: "Indicateurs certifiés",
    statValue: "32 / 32",
    extraMeta: "Audit blanc semestriel validé",
  },
  {
    id: "card-planning",
    icon: <CalendarCheck className="size-4 text-indigo-400" />,
    category: "Planning & Salles",
    badge: "0 Conflit",
    title: "Solveur d'Emplois du Temps",
    description: "Allocation optimisée des amphithéâtres, laboratoires et intervenants.",
    statLabel: "Capacité d'accueil campus",
    statValue: "1,240 places",
    extraMeta: "13 salles et labos synchronisés",
  },
  {
    id: "card-ai",
    icon: <Sparkles className="size-4 text-rose-400" />,
    category: "IA Pédagogique",
    badge: "Copilot v2.4",
    title: "Générateur de Syllabus RNCP",
    description: "Synthèse de parcours de formation, compétences et remédiation prédictive.",
    statLabel: "Modules générés",
    statValue: "48 Heures",
    extraMeta: "Détection précoce du décrochage",
  },
];

function CardItem({ card }: { card: ShowcaseCard }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-slate-900/95 hover:shadow-2xl">
      {/* Glow highlight */}
      <div className="pointer-events-none absolute -top-12 -right-12 size-24 rounded-full bg-primary/20 opacity-50 blur-2xl transition-opacity group-hover:opacity-100" />

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            {card.icon}
          </div>
          <span className="font-semibold text-[11px] text-slate-300 uppercase tracking-wider">{card.category}</span>
        </div>

        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300"
        >
          {card.badge}
        </Badge>
      </div>

      <div className="mt-3">
        <h4 className="font-bold text-slate-100 text-sm tracking-tight">{card.title}</h4>
        <p className="mt-1 line-clamp-2 text-slate-400 text-xs leading-relaxed">{card.description}</p>
      </div>

      <div className="mt-3.5 flex items-center justify-between border-white/5 border-t pt-2.5">
        <div>
          <div className="text-[10px] text-slate-400">{card.statLabel}</div>
          <div className="font-black text-slate-100 text-sm tracking-tight">{card.statValue}</div>
        </div>
        <div className="text-right font-medium text-[10px] text-emerald-400">{card.extraMeta}</div>
      </div>
    </div>
  );
}

export function AuthHeroShowcase() {
  // Double arrays to ensure smooth infinite loop
  const listA = [
    ...SHOWCASE_CARDS_COL_A.map((c) => ({ ...c, loopKey: `loop-1-${c.id}` })),
    ...SHOWCASE_CARDS_COL_A.map((c) => ({ ...c, loopKey: `loop-2-${c.id}` })),
  ];
  const listB = [
    ...SHOWCASE_CARDS_COL_B.map((c) => ({ ...c, loopKey: `loop-1-${c.id}` })),
    ...SHOWCASE_CARDS_COL_B.map((c) => ({ ...c, loopKey: `loop-2-${c.id}` })),
  ];

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary/90 p-6 lg:p-10">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-indigo-600/20 blur-3xl" />

      {/* Top Gradient Fade Mask */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-24 bg-gradient-to-b from-slate-950 via-slate-950/60 to-transparent" />

      {/* Vertical Animated Marquee Grid */}
      <div className="relative grid flex-1 grid-cols-2 gap-3.5 overflow-hidden py-4">
        {/* Column A */}
        <div className="flex animate-marquee-vertical flex-col gap-3.5">
          {listA.map((card) => (
            <CardItem key={card.loopKey} card={card} />
          ))}
        </div>

        {/* Column B */}
        <div className="flex animate-marquee-vertical-slow flex-col gap-3.5">
          {listB.map((card) => (
            <CardItem key={card.loopKey} card={card} />
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade Mask */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-44 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />

      {/* Bottom Branding & Institutional Info Overlay */}
      <div className="relative z-20 mt-2 space-y-2.5 rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="size-4" />
          </div>
          <h2 className="font-extrabold text-lg text-white tracking-tight">Onixe Center</h2>
          <Badge variant="outline" className="ml-auto border-white/20 bg-white/5 text-[10px] text-slate-300">
            Enterprise OS
          </Badge>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed">
          Système d&apos;exploitation pédagogique et administratif complet pour CFA, centres de formation et
          établissements d&apos;enseignement supérieur.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="flex items-center gap-1 font-medium text-[11px] text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            <span>Multi-Tenant</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1 font-medium text-[11px] text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            <span>Qualiopi & OPCO Ready</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1 font-medium text-[11px] text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            <span>ECTS & RNCP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
