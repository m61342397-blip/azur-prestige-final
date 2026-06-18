import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// ── GET : avis approuvés, les plus récents d'abord (affichage public) ──
export async function GET() {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("avis")
      .select("id, nom, note, commentaire, created_at")
      .eq("statut", "approuve")
      .order("created_at", { ascending: false })
      .limit(9);

    if (error) throw error;
    return NextResponse.json({ avis: data ?? [] });
  } catch (err) {
    console.error("GET /api/avis:", err);
    return NextResponse.json({ avis: [] }, { status: 500 });
  }
}

// ── POST : soumission d'un nouvel avis (statut en_attente) ──
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nom = String(body.nom ?? "").trim();
    const commentaire = String(body.commentaire ?? "").trim();
    const note = Number(body.note);

    if (!nom) return NextResponse.json({ error: "Le nom est requis." }, { status: 400 });
    if (!commentaire) return NextResponse.json({ error: "Le commentaire est requis." }, { status: 400 });
    if (!Number.isInteger(note) || note < 1 || note > 5)
      return NextResponse.json({ error: "La note doit être comprise entre 1 et 5." }, { status: 400 });

    const sb = supabaseAdmin();
    const { error } = await sb.from("avis").insert({
      nom: nom.slice(0, 80),
      note,
      commentaire: commentaire.slice(0, 1000),
      statut: "en_attente",
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/avis:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
