# Roadmap — Step 2: backend on user's own Supabase

Connection: external Supabase, ref `syjztybuacuszmxyrvgw` (already wired in `.env`, verified live). Not Lovable Cloud.

## Database (migration) — done
- [x] Enums: `app_role` (admin, reviewer), `tanda_kategori`, `hadith_status`, `sign_status`
- [x] `user_roles` + `has_role(user_id, role)` — runs as the caller (SECURITY INVOKER), not callable by visitors; linter clean
- [x] `hadiths` (code unique, kitab, nomor, bab, jenis, derajat, penilai_derajat, teks_arab, terjemah_id/en, matan_ringkas_id/en, syarah_ringkas, rujukan_syarah, link_sumber, kategori, status, tema, is_published, verified_by, verified_at, timestamps)
- [x] `signs` (slug, nama, deskripsi_singkat, kategori, status, urutan)
- [x] `sign_hadiths` (sign_id, hadith_id)
- [x] RLS: visitors read published hadith only; staff write via has_role; GRANTs on every table
- [x] Seed 3 `[DUMMY]` hadiths (published so the pages show content) + 9 signs + 4 sign↔hadith links

## Public pages — done
- [x] `/hadits` library: debounced search (tema, terjemah, matan), filter chips (kategori, status, kitab), cards, pagination, loading + empty states
- [x] `/hadits/$code` detail: Amiri RTL Arabic, ID/EN toggle, matan ringkas, source block + external link, derajat badge, syarah + rujukan ("Belum ada penjelasan ulama" when empty), related signs, copy link/text
- [x] Home: featured hadith + sign map from DB (positions derived from `urutan`), falls back to the built-in placeholders when the database is empty
- [x] Query state handed from server to browser so the first render matches the server HTML

## Admin (protected /admin, admin|reviewer only) — open
- [ ] Email/password login at `/admin/login`, logout, admin/reviewer access; no profiles or public signup
- [ ] `/admin/hadits`: search, filters, pagination, edit every field, related signs, verified publication, bulk actions
- [ ] `/admin/signs`: admin-only CRUD
- [ ] `/admin/import`: CSV/XLSX sheets, mapping, selected rows, validation, per-code duplicate decisions, draft-only batches, error download
- [ ] Database permissions: reviewer edits/publication, admin deletes/signs/import; publication validation trigger
- [ ] Rule tests, public regression checks, admin flow verification where available
- [ ] Exact first-admin SQL and external Supabase Auth dashboard instructions

## Handoff notes
- [x] First-admin SQL snippet (run in Supabase SQL editor after creating your account):
  ```sql
  insert into public.user_roles (user_id, role)
  select id, 'admin' from auth.users where email = 'email-anda@example.com';
  ```
- [ ] User must enable email/password provider: Supabase dashboard → Authentication → Providers → Email
- [ ] Replace the three `[DUMMY]` hadiths and the nine seed signs with authentic imported content

