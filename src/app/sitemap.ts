import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://azurprestige.eu", lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: "https://azurprestige.eu/reservation",   lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://azurprestige.eu/mentions-legales",    lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: "https://azurprestige.eu/confidentialite",     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: "https://azurprestige.eu/cgv",                 lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
  ];
}
