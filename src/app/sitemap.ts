import { MetadataRoute } from "next";

const SITE = "https://azurprestige.eu";
const LOCALES = ["fr", "en", "it", "es", "de"];
const DEFAULT_LOCALE = "fr";

// Pages indexées, avec leur fréquence/priorité. Chaque page est déclinée dans
// les 5 langues, et chaque URL liste ses variantes linguistiques (hreflang).
const PAGES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "",                  changeFrequency: "weekly",  priority: 1.0 },
  { path: "/reservation",      changeFrequency: "monthly", priority: 0.9 },
  { path: "/mentions-legales", changeFrequency: "yearly",  priority: 0.2 },
  { path: "/confidentialite",  changeFrequency: "yearly",  priority: 0.2 },
  { path: "/cgv",              changeFrequency: "yearly",  priority: 0.2 },
];

// URL absolue d'une page dans une langue (fr = sans préfixe, `as-needed`).
function urlFor(locale: string, path: string): string {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${SITE}${prefix}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const page of PAGES) {
    // Carte des alternates hreflang, partagée par toutes les variantes de la page.
    const languages: Record<string, string> = {};
    for (const locale of LOCALES) languages[locale] = urlFor(locale, page.path);
    languages["x-default"] = urlFor(DEFAULT_LOCALE, page.path);

    for (const locale of LOCALES) {
      entries.push({
        url: urlFor(locale, page.path),
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
