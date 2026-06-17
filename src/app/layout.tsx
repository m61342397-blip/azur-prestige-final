import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";

export const metadata: Metadata = {
  title: "Taxi Marseille Premium | Transferts Aéroport & Chauffeur Privé",
  description: "Service de taxi premium à Marseille. Transferts aéroport, déplacements professionnels, tourisme PACA. Disponible 24h/7j.",
  keywords: "taxi marseille, transfert aéroport marseille, chauffeur privé marseille, taxi tourisme marseille",
  openGraph: {
    title: "Taxi Marseille Premium | Azur Prestige",
    description: "Le transport premium pensé pour Marseille.",
    locale: "fr_FR", type: "website",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "TaxiService",
  "name": "Azur Prestige Taxi Marseille",
  "telephone": "+33-6-XX-XX-XX-XX",
  "address": { "@type": "PostalAddress", "addressLocality": "Marseille", "addressCountry": "FR" },
  "priceRange": "€€€",
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "847" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="grain">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
