-- ============================================================
--  Table « avis » — système d'avis clients avec modération
--  À exécuter dans : Supabase → SQL Editor → New query → Run
-- ============================================================

create table if not exists public.avis (
  id          uuid        primary key default gen_random_uuid(),
  nom         text        not null,
  note        integer     not null check (note between 1 and 5),
  commentaire text        not null,
  statut      text        not null default 'en_attente'
                          check (statut in ('en_attente', 'approuve', 'refuse')),
  created_at  timestamptz not null default now()
);

-- Index : accélère la récupération des avis approuvés les plus récents
create index if not exists avis_statut_created_idx
  on public.avis (statut, created_at desc);

-- ── Row Level Security ──────────────────────────────────────
-- La RLS est activée par sécurité (la clé anonyme est publique).
-- Lecture publique limitée aux avis approuvés ; les insertions et
-- les modifications de statut passent uniquement par l'API serveur
-- (clé service SUPABASE_SERVICE_KEY, qui contourne la RLS).
alter table public.avis enable row level security;

drop policy if exists "Lecture publique des avis approuvés" on public.avis;
create policy "Lecture publique des avis approuvés"
  on public.avis
  for select
  to anon, authenticated
  using (statut = 'approuve');
