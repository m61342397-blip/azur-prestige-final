import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Les 5 langues du site. Le français est la langue par défaut.
  locales: ["fr", "en", "it", "es", "de"],
  defaultLocale: "fr",

  // `as-needed` : la langue par défaut (fr) n'a PAS de préfixe d'URL
  // (azurprestige.eu/), les autres en ont un (/en, /it, /es, /de).
  localePrefix: "as-needed",

  // Pas de détection automatique via l'en-tête Accept-Language : on respecte
  // l'URL choisie (évite les redirections surprises depuis un lien partagé).
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
