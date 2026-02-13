-- ============================================================================
-- DOSSIERFRANKRIJK DATABASE SCHEMA
-- ============================================================================
-- Voer dit uit in Supabase SQL Editor (https://supabase.com/dashboard)
-- Project > SQL Editor > New Query > Plak dit > Run
-- ============================================================================

-- 1. FOLDERS TABEL
-- Mappen voor het organiseren van items
create table public.folders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  icon text default '📁',
  parent_id uuid references public.folders(id) on delete cascade,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. ITEMS TABEL
-- Bookmarks, notities, en checklists
create table public.items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  folder_id uuid references public.folders(id) on delete cascade not null,
  type text check (type in ('article', 'external', 'note', 'checklist')) not null,
  title text not null,
  url text,
  note_content text,
  source text,
  is_done boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================================================
-- METADATA KOLOM TOEVOEGEN (voor tool-data van Café Claude & InfoFrankrijk)
-- =============================================================================

-- Voeg metadata kolom toe aan items tabel
ALTER TABLE public.items 
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Index voor snelle JSON queries
CREATE INDEX IF NOT EXISTS items_metadata_idx ON public.items USING gin (metadata);

-- Voorbeelden van queries op metadata:
-- SELECT * FROM items WHERE metadata->>'tool' = 'energie_calculator';
-- SELECT * FROM items WHERE (metadata->'data'->>'ua_waarde')::numeric < 0.5;

-- =============================================================================
-- VERIFICATIE
-- =============================================================================
-- Check of de metadata kolom correct is toegevoegd:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'items' AND column_name = 'metadata';

-- 3. ROW LEVEL SECURITY (RLS)
-- Zorgt ervoor dat gebruikers alleen hun eigen data zien

-- Enable RLS
alter table public.folders enable row level security;
alter table public.items enable row level security;

-- Policies voor folders
create policy "Users can view own folders"
  on public.folders for select
  using (auth.uid() = user_id);

create policy "Users can insert own folders"
  on public.folders for insert
  with check (auth.uid() = user_id);

create policy "Users can update own folders"
  on public.folders for update
  using (auth.uid() = user_id);

create policy "Users can delete own folders"
  on public.folders for delete
  using (auth.uid() = user_id);

-- Policies voor items
create policy "Users can view own items"
  on public.items for select
  using (auth.uid() = user_id);

create policy "Users can insert own items"
  on public.items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own items"
  on public.items for update
  using (auth.uid() = user_id);

create policy "Users can delete own items"
  on public.items for delete
  using (auth.uid() = user_id);

-- 4. INDEXES
-- Voor snellere queries
create index folders_user_id_idx on public.folders(user_id);
create index items_user_id_idx on public.items(user_id);
create index items_folder_id_idx on public.items(folder_id);

-- 5. AUTOMATISCH USER_ID INVULLEN
-- Zodat de app niet handmatig user_id hoeft mee te sturen

-- Function om user_id automatisch in te vullen
create or replace function public.set_user_id()
returns trigger as $$
begin
  new.user_id := auth.uid();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger voor folders
create trigger set_folders_user_id
  before insert on public.folders
  for each row execute function public.set_user_id();

-- Trigger voor items
create trigger set_items_user_id
  before insert on public.items
  for each row execute function public.set_user_id();

-- ============================================================================
-- KLAAR!
-- Je database is nu geconfigureerd.
-- ============================================================================
