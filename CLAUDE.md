# CLAUDE.md — akhirzaman.id

Platform dakwah: hadis **shahih** tentang tanda-tanda akhir zaman (pemahaman Ahlus Sunnah wal Jama'ah, manhaj salaf), dikaitkan dengan peristiwa kini, plus timeline penciptaan sampai akhirat. Bahasa: Indonesia, Inggris, Arab (RTL). Pemilik: Erwin. Bahasa kerja: Indonesia (istilah teknis boleh Inggris). Konteks lengkap: `HANDOFF.md` (di luar repo), `AGENTS.md`, `roadmap.md`, `ADMIN_SETUP.md`.

## Aturan isi (tidak boleh dilanggar)

1. Hanya hadis `is_published = true` yang tampil ke publik. Tidak ada jalan pintas.
2. Teks hadis **tidak pernah** ditulis atau "diingat" AI. Teks Arab, terjemah, nomor, derajat hanya dari data terverifikasi di database. AI hanya boleh mencocokkan berita dengan hadis yang SUDAH terbit.
3. Semua keluaran AI (kaitan berita-hadis, ringkasan, terjemah) berstatus **draf** dan wajib ditinjau ustadz. Tidak ada auto-publish.
4. Bahasa hati-hati: "relevan dengan tema hadis", bukan "inilah yang dimaksud Nabi ﷺ". Dilarang: menentukan tanggal kiamat; menunjuk orang/kelompok/peristiwa tertentu sebagai Mahdi, Dajjal, Ya'juj-Ma'juj, atau dabbah; klaim yang menakut-nakuti. Disclaimer di footer jangan dihapus.
5. Syarah hanya dari kitab rujukan yang disetujui ustadz (Fathul Bari, Syarh Shahih Muslim, An-Nihayah fil Fitan wal Malahim, Asyrath as-Sa'ah, fatwa Ibnu Baz dan Ibnu Utsaimin). Jangan mengarang syarah, halaman, atau kutipan; kosongkan bila tak dapat ditelusuri.
6. Status tanda (sudah terjadi / sedang berlangsung / belum terjadi) adalah penilaian ustadz. Jangan diisi otomatis.
7. Tanpa pendaftaran publik. Akun dibuat manual oleh admin lewat dashboard Supabase.
8. Timeline hanya berdasar Al-Qur'an dan hadis shahih. Waspadai Israiliyyat dan riwayat diperselisihkan (mis. Muslim no. 2789 tentang hari-hari penciptaan: jangan dipakai sebelum ustadz memutuskan).
9. Hadis sifat Allah disajikan sesuai pemahaman salaf, tanpa takwil.
10. Tanpa gambar makhluk bernyawa di desain.

Bila ragu pada konten keagamaan, jangan menebak; tandai untuk ustadz.

## Aturan teknis

- Stack: TanStack Start + Vite + React 19 + Tailwind v4 + shadcn/ui. Package manager proyek: Bun (`bun.lock`). Supabase milik sendiri (bukan Lovable Cloud), ref `syjztybuacuszmxyrvgw`.
- Perintah: `lint` (eslint), `test` (vitest run), `dev`, `build` (lihat `package.json`).
- Repo disinkronkan dua arah dengan Lovable di `main`. **Jangan menulis ulang riwayat git** (force push, rebase, amend, squash pada commit yang sudah di-push). Commit biasa ke `main`; `git pull` dulu sebelum mulai. Deploy: pemilik menekan Publish di Lovable setelah push.
- **Migrasi database tidak otomatis.** File baru di `supabase/migrations/` dijalankan manual oleh pemilik. Selalu jelaskan SQL-nya dan minta konfirmasi sebelum menyarankan menjalankannya.
- Jangan menaruh `SUPABASE_SERVICE_ROLE_KEY` di repo (hanya di environment server / `.env.local`). `.env` hanya berisi publishable key; jangan menambah rahasia ke sana.
- Semua baca/tulis admin lewat server function terautentikasi dan RLS. Jangan pakai klien admin (service role) untuk jalur publik.

## Cara bekerja dengan pemilik

- Jelaskan sebelum mengubah file sensitif (migrasi, RLS, auth). Minta persetujuan untuk perubahan skema dan apa pun yang menyentuh publikasi hadis.
- Pemilik bukan developer penuh; jelaskan langkah manual (Supabase, GitHub) dengan jelas.

## Desain (ringkas)

Konsep "Fajar dari Barat", palet "Ink & Dawn" (dark-first, ada light mode). Instrument Serif (judul), Geist/Inter (UI), Amiri (Arab, RTL, berharakat). Status tanda: Sudah Terjadi = Bone solid; Sedang Berlangsung = Dawn berdenyut; Belum Terjadi = outline Mist. Hindari merah/hijau. Motion lambat; hormati `prefers-reduced-motion`.
