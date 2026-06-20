import { routing } from "./routing";

/**
 * Construit les alternates hreflang pour une page donnée, à partir de son
 * chemin SANS préfixe de langue (ex. "" pour l'accueil, "/cgv", "/reservation").
 *
 * Résultat : { canonical, languages: { fr, en, it, es, de, "x-default" } }
 * Combiné au `metadataBase` du layout, Next génère les <link rel="alternate"
 * hreflang="…"> appropriés dans le <head>.
 */
export function buildAlternates(path: string, locale: string) {
  const urlFor = (loc: string) => {
    const prefix = loc === routing.defaultLocale ? "" : `/${loc}`;
    const url = `${prefix}${path}`;
    return url === "" ? "/" : url;
  };

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = urlFor(loc);
  }
  languages["x-default"] = urlFor(routing.defaultLocale);

  return {
    canonical: urlFor(locale),
    languages,
  };
}
