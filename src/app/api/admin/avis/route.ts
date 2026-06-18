import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Vérifie le mot de passe admin envoyé dans l'en-tête x-admin-password.
function authorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return req.headers.get("x-admin-password") === expected;
}

// ── GET : liste complète des avis pour la modération ──
export async function GET(req: NextRequest) {
  if (!authorized(req))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("avis")
      .select("id, nom, note, commentaire, statut, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ avis: data ?? [] });
  } catch (err) {
    console.error("GET /api/admin/avis:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

// ── PATCH : changer le statut d'un avis (approuve / refuse) ──
export async function PATCH(req: NextRequest) {
  if (!authorized(req))
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  try {
    const body = await req.json();
    const id = String(body.id ?? "");
    const statut = String(body.statut ?? "");

    if (!id) return NextResponse.json({ error: "Identifiant manquant." }, { status: 400 });
    if (statut !== "approuve" && statut !== "refuse")
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });

    const sb = supabaseAdmin();
    const { error } = await sb.from("avis").update({ statut }).eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/avis:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
