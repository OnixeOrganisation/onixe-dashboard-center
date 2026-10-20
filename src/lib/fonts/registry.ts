import { Geist, Geist_Mono, Inter, Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const fontRegistry = {
  raleway: {
    label: "Raleway (Onixe Default)",
    font: raleway,
  },
  geist: {
    label: "Geist",
    font: geist,
  },
  inter: {
    label: "Inter",
    font: inter,
  },
  geistMono: {
    label: "Geist Mono",
    font: geistMono,
  },
  notoSans: {
    label: "Noto Sans",
    font: inter,
  },
  nunitoSans: {
    label: "Nunito Sans",
    font: inter,
  },
  figtree: {
    label: "Figtree",
    font: inter,
  },
  roboto: {
    label: "Roboto",
    font: inter,
  },
  dmSans: {
    label: "DM Sans",
    font: inter,
  },
  publicSans: {
    label: "Public Sans",
    font: inter,
  },
  outfit: {
    label: "Outfit",
    font: inter,
  },
  geistPixelSquare: {
    label: "Geist Pixel Square",
    font: geistMono,
  },
  jetBrainsMono: {
    label: "JetBrains Mono",
    font: geistMono,
  },
  notoSerif: {
    label: "Noto Serif",
    font: raleway,
  },
  robotoSlab: {
    label: "Roboto Slab",
    font: raleway,
  },
  merriweather: {
    label: "Merriweather",
    font: raleway,
  },
  lora: {
    label: "Lora",
    font: raleway,
  },
  playfairDisplay: {
    label: "Playfair Display",
    font: raleway,
  },
} as const;

export type FontKey = keyof typeof fontRegistry;

export const fontKeys = Object.keys(fontRegistry) as FontKey[];

export const fontVars = Array.from(new Set(Object.values(fontRegistry).map(({ font }) => font.variable))).join(" ");

export const fontOptions = fontKeys.map((key) => ({
  key,
  label: fontRegistry[key].label,
}));
