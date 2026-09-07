import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Onixe",
  version: packageJson.version,
  copyright: `© ${currentYear}, Onixe.`,
  meta: {
    title: "Onixe Centre - Système d'Exploitation Pédagogique",
    description:
      "Onixe Centre de Formation - Infrastructure et Télémétrie Pédagogique pour Organismes de Formation et CFA.",
  },
};
