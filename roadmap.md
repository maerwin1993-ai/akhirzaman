# Roadmap — Step 2: backend on user's own Supabase

Connection: external Supabase, ref `syjztybuacuszmxyrvgw` (already wired in `.env`, verified live). Not Lovable Cloud.

## Database (migration)
- [ ] Enums: `app_role` (admin, reviewer), hadith `kategori`, hadith `status`
- [ ] `user_roles` + security-definer `has_role(user_id, role)`
- [ ] `hadiths` (code unique, kitab, nomor, bab, jenis, derajat, penilai_derajat, teks_arab, terjemah_id/en, matan_ringkas_id/en, syarah_ringkas, rujukan_syarah, link_sumber, kategori, status, tema, is_published default false, verified_by, verified_at, timestamps)
- [ ] `signs` (slug, nama, deskripsi_singkat, kategori, status, urutan)
- [ ] `sign_hadiths` (sign_id, hadith_id)
- [ ] RLS: anon SELECT only `is_published = true`; admin/reviewer write; GRANTs for every table
- [ ] Seed 3 `[DUMMY]` hadiths, unpublished

## Public pages
- [ ] `/hadits` library: search (tema, terjemah, matan ringkas), filter chips (kategori, status, kitab), cards, pagination, loading + empty states
- [ ] `/hadits/:code` detail: Amiri RTL Arabic, ID/EN toggle, matan ringkas, source link, derajat badge, syarah + rujukan (graceful "Belum ada penjelasan ulama"), related signs, copy link/text
- [ ] Home: featured hadith + sign map from DB, fall back to current placeholders when empty

## Admin (protected /admin, admin|reviewer only)
- [ ] Email + password login, no public sign-up page
- [ ] `/admin/hadits`: table, search, filters, inline publish toggle, full edit form
- [ ] `/admin/import`: CSV/XLSX upload, column mapping, preview + validation report (missing required, duplicate code), rows land unpublished

## Handoff notes
- [ ] First-admin SQL snippet for Supabase SQL editor
- [ ] Tell user to enable email/password provider in Supabase dashboard
