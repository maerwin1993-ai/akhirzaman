-- ============================================================
-- akhirzaman.id — Step 2 backend schema
-- ============================================================

-- ---------- Enums ----------
create type public.app_role as enum ('admin', 'reviewer');
create type public.tanda_kategori as enum ('tanda_kecil', 'tanda_besar', 'fitnah', 'akhirat', 'umum');
create type public.hadith_status as enum ('sudah_terjadi', 'sedang_berlangsung', 'belum_terjadi', 'tidak_berlaku');
create type public.sign_status as enum ('sudah_terjadi', 'sedang_berlangsung', 'belum_terjadi');

-- ---------- user_roles ----------
create table public.user_roles (
  id uuid not null primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant usage on schema public to anon, authenticated;
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "user_roles: members read their own role"
  on public.user_roles for select to authenticated
  using (auth.uid() = user_id);

-- ---------- role check (security definer, no RLS recursion) ----------
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  );
$$;

-- ---------- hadiths ----------
create table public.hadiths (
  id uuid not null primary key default gen_random_uuid(),
  code text not null unique,
  kitab text,
  nomor text,
  bab text,
  jenis text,
  derajat text,
  penilai_derajat text,
  teks_arab text not null,
  terjemah_id text,
  terjemah_en text,
  matan_ringkas_id text,
  matan_ringkas_en text,
  syarah_ringkas text,
  rujukan_syarah text,
  link_sumber text,
  kategori public.tanda_kategori,
  status public.hadith_status,
  tema text,
  is_published boolean not null default false,
  verified_by text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.hadiths to anon, authenticated;
grant insert, update, delete on public.hadiths to authenticated;
grant all on public.hadiths to service_role;

alter table public.hadiths enable row level security;

create policy "hadiths: public reads published only"
  on public.hadiths for select to anon, authenticated
  using (is_published = true);

create policy "hadiths: staff reads everything"
  on public.hadiths for select to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'reviewer'));

create policy "hadiths: staff inserts"
  on public.hadiths for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'reviewer'));

create policy "hadiths: staff updates"
  on public.hadiths for update to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'reviewer'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'reviewer'));

create policy "hadiths: staff deletes"
  on public.hadiths for delete to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'reviewer'));

create index hadiths_published_idx on public.hadiths (is_published);
create index hadiths_kategori_idx on public.hadiths (kategori);
create index hadiths_status_idx on public.hadiths (status);
create index hadiths_kitab_idx on public.hadiths (kitab);
create index hadiths_tema_idx on public.hadiths (tema);

-- ---------- signs ----------
create table public.signs (
  id uuid not null primary key default gen_random_uuid(),
  slug text not null unique,
  nama text not null,
  deskripsi_singkat text,
  kategori public.tanda_kategori,
  status public.sign_status not null default 'belum_terjadi',
  urutan integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.signs to anon, authenticated;
grant insert, update, delete on public.signs to authenticated;
grant all on public.signs to service_role;

alter table public.signs enable row level security;

create policy "signs: everyone reads the map"
  on public.signs for select to anon, authenticated
  using (true);

create policy "signs: staff inserts"
  on public.signs for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'reviewer'));

create policy "signs: staff updates"
  on public.signs for update to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'reviewer'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'reviewer'));

create policy "signs: staff deletes"
  on public.signs for delete to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'reviewer'));

create index signs_urutan_idx on public.signs (urutan);

-- ---------- sign_hadiths ----------
create table public.sign_hadiths (
  sign_id uuid not null references public.signs (id) on delete cascade,
  hadith_id uuid not null references public.hadiths (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (sign_id, hadith_id)
);

grant select on public.sign_hadiths to anon, authenticated;
grant insert, update, delete on public.sign_hadiths to authenticated;
grant all on public.sign_hadiths to service_role;

alter table public.sign_hadiths enable row level security;

create policy "sign_hadiths: everyone reads links"
  on public.sign_hadiths for select to anon, authenticated
  using (true);

create policy "sign_hadiths: staff inserts"
  on public.sign_hadiths for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'reviewer'));

create policy "sign_hadiths: staff updates"
  on public.sign_hadiths for update to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'reviewer'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'reviewer'));

create policy "sign_hadiths: staff deletes"
  on public.sign_hadiths for delete to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'reviewer'));

-- ---------- updated_at upkeep ----------
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger hadiths_updated_at
  before update on public.hadiths
  for each row execute function public.update_updated_at_column();

create trigger signs_updated_at
  before update on public.signs
  for each row execute function public.update_updated_at_column();

-- ---------- seed: 3 [DUMMY] hadiths, unpublished ----------
insert into public.hadiths
  (code, kitab, nomor, bab, jenis, derajat, penilai_derajat, teks_arab, terjemah_id, terjemah_en,
   matan_ringkas_id, matan_ringkas_en, syarah_ringkas, rujukan_syarah, link_sumber,
   kategori, status, tema, is_published)
values
  ('H001', 'Shahih Muslim', '2901', 'Kitab al-Fitan', 'hadits qauli', 'Shahih', 'Imam Muslim',
   'لَا تَقُومُ السَّاعَةُ حَتَّى تَكُونَ عَشْرُ آيَاتٍ',
   '[DUMMY] Tidak akan terjadi kiamat hingga muncul sepuluh tanda …',
   '[DUMMY] The Hour will not come until ten signs appear …',
   '[DUMMY] Ringkasan matan: sepuluh tanda besar akan mendahului kiamat.',
   '[DUMMY] Matan summary: ten great signs precede the Hour.',
   '[DUMMY] Penjelasan ulama salaf mengenai kesepuluh tanda tersebut.',
   '[DUMMY] Rujukan syarah akan dilengkapi tim redaksi.',
   'https://sunnah.com/muslim:2901',
   'tanda_besar', 'belum_terjadi', '[DUMMY] Sepuluh tanda besar', false),

  ('H002', 'Shahih al-Bukhari', '7121', 'Kitab ar-Riqaq', 'hadits qauli', 'Shahih', 'Imam al-Bukhari',
   'يَتَطَاوَلُونَ فِي الْبُنْيَانِ',
   '[DUMMY] Manusia berlomba-lomba meninggikan bangunan …',
   '[DUMMY] People compete to raise tall buildings …',
   '[DUMMY] Ringkasan matan: berlomba meninggikan bangunan termasuk tanda kecil.',
   '[DUMMY] Matan summary: competing in tall buildings is a minor sign.',
   '',
   '',
   'https://sunnah.com/bukhari:7121',
   'tanda_kecil', 'sedang_berlangsung', '[DUMMY] Berlomba meninggikan bangunan', false),

  ('H003', 'Shahih Muslim', '155', 'Kitab an-Nikah', 'hadits qauli', 'Shahih', 'Imam Muslim',
   'يَكُونُ فِي آخِرِ الزَّمَانِ أَمْوَالٌ تُقْسَمُ وَيَظْهَرُ الرِّبَا',
   '[DUMMY] Di akhir zaman harta tersebar dan riba tampak jelas …',
   '[DUMMY] In the last time wealth is distributed and usury becomes visible …',
   '[DUMMY] Ringkasan matan: meluasnya riba di akhir zaman.',
   '[DUMMY] Matan summary: the spread of usury in the last time.',
   '',
   '',
   'https://sunnah.com/muslim:155',
   'tanda_kecil', 'sedang_berlangsung', '[DUMMY] Meluasnya riba', false);