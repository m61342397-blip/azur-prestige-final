import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase — App Router.
 *
 * - `supabaseBrowser()` : clé anonyme (publique). Utilisable côté navigateur.
 *   La RLS s'applique : ne voit que les avis approuvés.
 * - `supabaseAdmin()`   : clé service. SERVEUR UNIQUEMENT (route handlers).
 *   Contourne la RLS — ne jamais importer dans un composant client.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function supabaseBrowser() {
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Variables Supabase publiques manquantes.");
  return createClient(url, anon);
}

export function supabaseAdmin() {
  const service = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !service) throw new Error("Variables Supabase serveur manquantes.");
  return createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type Avis = {
  id: string;
  nom: string;
  note: number;
  commentaire: string;
  statut: "en_attente" | "approuve" | "refuse";
  created_at: string;
};
