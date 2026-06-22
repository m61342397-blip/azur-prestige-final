import { supabaseAdmin } from "@/lib/supabase";

/**
 * Données structurées (JSON-LD) de l'entreprise — réservées à la page d'accueil.
 *
 * On utilise `LocalBusiness` (+ le sous-type `TaxiService`) car les extraits
 * d'avis de Google ne sont éligibles que pour une liste fermée de types : un
 * simple `Service`/`TaxiService` n'en fait PAS partie, d'où l'erreur Search
 * Console « Type d'objet non valide pour le champ » sur `aggregateRating`.
 */
type JsonLd = Record<string, unknown>;

function baseJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TaxiService"],
    "name": "Azur Prestige Taxi Marseille",
    "telephone": "+33-6-66-32-38-17",
    "url": "https://azurprestige.eu",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Marseille",
      "addressCountry": "FR",
    },
    "priceRange": "€€€",
  };
}

// Récupère les avis approuvés et calcule la note moyenne. Renvoie `null` si
// aucun avis n'est encore approuvé (ou en cas d'erreur) afin que le JSON-LD
// soit généré SANS `aggregateRating`/`review` plutôt qu'avec des valeurs
// vides/nulles que Google rejette.
async function getReviewStats() {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("avis")
      .select("nom, note, commentaire, created_at")
      .eq("statut", "approuve")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return null;

    const count = data.length;
    const sum = data.reduce((acc, r) => acc + Number(r.note), 0);
    const ratingValue = Math.round((sum / count) * 10) / 10;

    return { count, ratingValue, reviews: data };
  } catch {
    return null;
  }
}

export async function buildJsonLd(): Promise<JsonLd> {
  const jsonLd = baseJsonLd();
  const stats = await getReviewStats();

  // Pas d'avis approuvé → on n'ajoute NI aggregateRating NI review.
  if (!stats) return jsonLd;

  jsonLd.aggregateRating = {
    "@type": "AggregateRating",
    "ratingValue": stats.ratingValue,
    "reviewCount": stats.count,
    "bestRating": 5,
    "worstRating": 1,
  };

  // On joint les avis réels qui soutiennent la note agrégée (max 5).
  jsonLd.review = stats.reviews.slice(0, 5).map((r) => ({
    "@type": "Review",
    "author": { "@type": "Person", "name": r.nom },
    "datePublished": String(r.created_at).slice(0, 10),
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": Number(r.note),
      "bestRating": 5,
      "worstRating": 1,
    },
    "reviewBody": r.commentaire,
  }));

  return jsonLd;
}
