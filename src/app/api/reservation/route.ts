import { NextRequest, NextResponse } from "next/server";
import { emailClient, emailChauffeur } from "@/lib/emailTemplates";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validation
    const required = ["prenom", "nom", "telephone", "email", "date_course", "heure_course", "depart", "destination"];
    for (const field of required) {
      if (!data[field]?.toString().trim()) {
        return NextResponse.json({ error: `Champ manquant : ${field}` }, { status: 400 });
      }
    }

    const refId = `AZP-${Date.now().toString(36).toUpperCase()}`;
    const payload = { ...data, refId, nb_passagers: Number(data.nb_passagers) || 1, nb_bagages: Number(data.nb_bagages) || 0 };

    // ── Supabase (optionnel) ─────────────────────────────────────
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
        await sb.from("reservations").insert({ ref: refId, ...data, statut: "en_attente" });
      } catch (e) { console.error("Supabase (non-fatal):", e); }
    }

    // ── Resend (emails HTML premium) ─────────────────────────────
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.FROM_EMAIL ?? "Azur Prestige <onboarding@resend.dev>";

        const dateFormatted = new Date(data.date_course).toLocaleDateString("fr-FR", {
          weekday: "long", day: "numeric", month: "long", year: "numeric"
        });

        // Email client
        await resend.emails.send({
          from,
          to:      data.email,
          subject: `Votre réservation Azur Prestige — ${dateFormatted} à ${data.heure_course}`,
          html:    emailClient(payload),
        });

        // Email chauffeur
        const ownerEmail = process.env.CHAUFFEUR_EMAIL ?? process.env.OWNER_EMAIL;
        if (ownerEmail) {
          await resend.emails.send({
            from,
            to:      ownerEmail,
            subject: `Réservation ${refId} — ${data.prenom} ${data.nom} | ${dateFormatted} ${data.heure_course}`,
            html:    emailChauffeur(payload),
          });
        }
      } catch (e) { console.error("Resend (non-fatal):", e); }
    }

    return NextResponse.json({ success: true, id: refId });

  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
