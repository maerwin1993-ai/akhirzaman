# akhirzaman.id

Platform dakwah: kumpulan hadis shahih tentang tanda-tanda akhir zaman, dijelaskan sesuai pemahaman Ahlus Sunnah wal Jama'ah dan manhaj salaf.

Proyek ini dibangun dengan [Lovable](https://lovable.dev) dan disinkronkan dua arah dengan repo ini pada branch `main`.

**Situs publik**: https://akhirzaman.lovable.app

## Pengembangan lokal

Butuh [Bun](https://bun.sh).

```sh
git clone https://github.com/maerwin1993-ai/akhirzaman.git
cd akhirzaman
bun install
bun run dev
```

Perintah lain:

```sh
bun run lint
bun run test
bun run build
```

## Catatan penting

- Jangan menulis ulang riwayat git (force push, rebase, amend, squash pada commit yang sudah di-push). Lihat `AGENTS.md`.
- Migrasi database di `supabase/migrations/` dijalankan manual di Supabase, tidak otomatis.
- Pengaturan admin pertama: lihat `ADMIN_SETUP.md`. Aturan isi dan teknis: lihat `CLAUDE.md`.
