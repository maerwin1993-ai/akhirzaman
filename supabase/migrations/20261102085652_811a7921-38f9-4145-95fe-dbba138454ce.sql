-- ============================================================
-- Seed placeholder signs + publish the three placeholder hadith
-- so the public library, detail pages and Home map are live.
-- ============================================================

-- 1. Make the three [DUMMY] hadith visible to visitors.
update public.hadiths set is_published = true;

-- 2. Signs shown on the Home constellation map.
insert into public.signs (slug, nama, deskripsi_singkat, kategori, status, urutan) values
  ('diutusnya-nabi',    'Diutusnya Nabi ﷺ',        '[DUMMY] Ringkasan tanda.', 'tanda_kecil', 'sudah_terjadi',      1),
  ('terbelahnya-bulan', 'Terbelahnya Bulan',        '[DUMMY] Ringkasan tanda.', 'tanda_kecil', 'sudah_terjadi',      2),
  ('bangunan-tinggi',   'Berlomba Bangunan Tinggi', '[DUMMY] Ringkasan tanda.', 'tanda_kecil', 'sedang_berlangsung', 3),
  ('meluasnya-riba',    'Meluasnya Riba',           '[DUMMY] Ringkasan tanda.', 'tanda_kecil', 'sedang_berlangsung', 4),
  ('banyaknya-gempa',   'Banyaknya Gempa Bumi',     '[DUMMY] Ringkasan tanda.', 'tanda_kecil', 'sedang_berlangsung', 5),
  ('imam-mahdi',        'Datangnya Al-Mahdi',       '[DUMMY] Ringkasan tanda.', 'tanda_besar', 'belum_terjadi',      6),
  ('fitnah-dajjal',     'Fitnah Dajjal',            '[DUMMY] Ringkasan tanda.', 'tanda_besar', 'belum_terjadi',      7),
  ('turunnya-isa',      'Turunnya Nabi Isa',        '[DUMMY] Ringkasan tanda.', 'tanda_besar', 'belum_terjadi',      8),
  ('keluarnya-dabbah',  'Keluarnya Dabbah',         '[DUMMY] Ringkasan tanda.', 'tanda_besar', 'belum_terjadi',      9)
on conflict (slug) do update set
  nama = excluded.nama,
  deskripsi_singkat = excluded.deskripsi_singkat,
  kategori = excluded.kategori,
  status = excluded.status,
  urutan = excluded.urutan;

-- 3. Which hadith sit behind which sign.
insert into public.sign_hadiths (sign_id, hadith_id)
select s.id, h.id
from public.signs s, public.hadiths h
where (s.slug = 'bangunan-tinggi' and h.code = 'H002')
   or (s.slug = 'meluasnya-riba'  and h.code = 'H003')
   or (s.slug = 'imam-mahdi'      and h.code = 'H001')
   or (s.slug = 'fitnah-dajjal'   and h.code = 'H001')
on conflict do nothing;