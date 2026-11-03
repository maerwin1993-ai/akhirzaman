// Data statis untuk /timeline ("Zoom Waktu").
//
// Bentuk `TimelineNode` sengaja sama dengan kolom tabel `timeline_nodes` di masa depan
// (id, urutan, fase, judul_id, judul_en, ringkasan, dalil[], reviewed) supaya nanti
// tinggal dipindah ke database tanpa mengubah komponen.
//
// Aturan isi (lihat CLAUDE.md):
// - `reviewed` default false. Di produksi hanya node reviewed:true yang dirender;
//   selebihnya halaman hanya menampilkan kerangka fase. Ringkasan di bawah adalah draf AI.
// - `dalil` dikosongkan: ustadz yang memilih ayat dan hadis. Tidak ada teks ayat atau
//   hadis di file ini; ayat hanya berupa rujukan "surah:ayat", hadis hanya kode di database.
// - Tidak memakai Muslim no. 2789 (hari-hari penciptaan) sebelum ustadz memutuskan.

export type TimelineFase =
  | "penciptaan"
  | "para_nabi"
  | "nabi_muhammad"
  | "tanda_kecil"
  | "tanda_besar"
  | "sangkakala"
  | "barzakh"
  | "kebangkitan"
  | "hisab"
  | "balasan";

export type Dalil =
  | { jenis: "ayat"; rujukan: string } // "surah:ayat", mis. "2:30"; teks ayat tidak disimpan
  | { jenis: "hadis"; code: string }; // kode hadis di tabel `hadiths`; hanya yang terbit yang bisa dibuka

export type TimelineNode = {
  id: string;
  urutan: number;
  fase: TimelineFase;
  judul_id: string;
  judul_en: string;
  ringkasan: string;
  dalil: Dalil[];
  reviewed: boolean;
};

export type FaseInfo = { fase: TimelineFase; judul_id: string; judul_en: string };

export const FASE_LIST: FaseInfo[] = [
  { fase: "penciptaan", judul_id: "Awal Manusia", judul_en: "The Beginning of Mankind" },
  { fase: "para_nabi", judul_id: "Para Nabi", judul_en: "The Prophets" },
  { fase: "nabi_muhammad", judul_id: "Nabi Muhammad ﷺ", judul_en: "Prophet Muhammad ﷺ" },
  { fase: "tanda_kecil", judul_id: "Tanda-tanda Kecil", judul_en: "The Minor Signs" },
  { fase: "tanda_besar", judul_id: "Tanda-tanda Besar", judul_en: "The Major Signs" },
  { fase: "sangkakala", judul_id: "Tiupan Sangkakala", judul_en: "The Trumpet" },
  { fase: "barzakh", judul_id: "Alam Barzakh", judul_en: "Barzakh" },
  { fase: "kebangkitan", judul_id: "Kebangkitan dan Mahsyar", judul_en: "Resurrection and Gathering" },
  { fase: "hisab", judul_id: "Hisab, Mizan, dan Shirath", judul_en: "Reckoning, Scale, and the Bridge" },
  { fase: "balasan", judul_id: "Surga dan Neraka", judul_en: "Paradise and Hellfire" },
];

// Ringkasan sengaja pendek dan umum: draf AI, belum ditinjau ustadz (reviewed:false).
export const TIMELINE_NODES: TimelineNode[] = [
  {
    id: "adam",
    urutan: 1,
    fase: "penciptaan",
    judul_id: "Nabi Adam ‘alaihis salam",
    judul_en: "Prophet Adam, peace be upon him",
    ringkasan: "Manusia pertama dan nabi pertama.",
    dalil: [],
    reviewed: false,
  },
  {
    id: "para-nabi",
    urutan: 2,
    fase: "para_nabi",
    judul_id: "Para nabi dan rasul",
    judul_en: "The prophets and messengers",
    ringkasan: "Allah mengutus para nabi dan rasul kepada umat manusia.",
    dalil: [],
    reviewed: false,
  },
  {
    id: "diutusnya-nabi",
    urutan: 3,
    fase: "nabi_muhammad",
    judul_id: "Diutusnya Nabi Muhammad ﷺ",
    judul_en: "The sending of Prophet Muhammad ﷺ",
    ringkasan: "Nabi terakhir dan penutup para nabi.",
    dalil: [],
    reviewed: false,
  },
  {
    id: "tanda-kecil",
    urutan: 4,
    fase: "tanda_kecil",
    judul_id: "Tanda-tanda kecil kiamat",
    judul_en: "The minor signs of the Hour",
    ringkasan: "Tanda-tanda yang disebut dalam hadis shahih sebagai pendahuluan.",
    dalil: [],
    reviewed: false,
  },
  {
    id: "tanda-besar",
    urutan: 5,
    fase: "tanda_besar",
    judul_id: "Tanda-tanda besar kiamat",
    judul_en: "The major signs of the Hour",
    ringkasan: "Tanda-tanda besar yang disebut dalam hadis shahih.",
    dalil: [],
    reviewed: false,
  },
  {
    id: "sangkakala",
    urutan: 6,
    fase: "sangkakala",
    judul_id: "Tiupan sangkakala",
    judul_en: "The blowing of the Trumpet",
    ringkasan: "Peristiwa tiupan sangkakala.",
    dalil: [],
    reviewed: false,
  },
  {
    id: "barzakh",
    urutan: 7,
    fase: "barzakh",
    judul_id: "Barzakh",
    judul_en: "Barzakh",
    ringkasan: "Alam di antara kematian dan hari kebangkitan.",
    dalil: [],
    reviewed: false,
  },
  {
    id: "kebangkitan",
    urutan: 8,
    fase: "kebangkitan",
    judul_id: "Kebangkitan",
    judul_en: "The Resurrection",
    ringkasan: "Manusia dibangkitkan dari kubur.",
    dalil: [],
    reviewed: false,
  },
  {
    id: "mahsyar",
    urutan: 9,
    fase: "kebangkitan",
    judul_id: "Mahsyar",
    judul_en: "The Gathering",
    ringkasan: "Manusia dikumpulkan untuk perhitungan amal.",
    dalil: [],
    reviewed: false,
  },
  {
    id: "hisab-mizan",
    urutan: 10,
    fase: "hisab",
    judul_id: "Hisab dan mizan",
    judul_en: "Reckoning and the Scale",
    ringkasan: "Amal diperhitungkan dan ditimbang.",
    dalil: [],
    reviewed: false,
  },
  {
    id: "shirath",
    urutan: 11,
    fase: "hisab",
    judul_id: "Shirath",
    judul_en: "The Bridge (Sirat)",
    ringkasan: "Jembatan yang harus dilalui.",
    dalil: [],
    reviewed: false,
  },
  {
    id: "surga-neraka",
    urutan: 12,
    fase: "balasan",
    judul_id: "Surga dan neraka",
    judul_en: "Paradise and Hellfire",
    ringkasan: "Tempat kembali yang terakhir.",
    dalil: [],
    reviewed: false,
  },
];

// Penanda "Kita di sini" menempel pada node ini dan hanya tampil bila node itu tampil
// (artinya sudah ditinjau ustadz). Posisi ini penilaian ustadz, bukan klaim otomatis.
export const KITA_DI_SINI_NODE_ID = "tanda-kecil";

export type VisibleTimeline = {
  nodes: TimelineNode[];
  // Fase yang selalu tampil sebagai kerangka, walau belum ada node yang ditinjau.
  fase: (FaseInfo & { nodes: TimelineNode[] })[];
};

// `showDrafts` true hanya di pengembangan (import.meta.env.DEV). Di produksi hanya reviewed:true.
export function getVisibleTimeline(
  nodes: TimelineNode[] = TIMELINE_NODES,
  { showDrafts = false }: { showDrafts?: boolean } = {},
): VisibleTimeline {
  const visible = nodes.filter((n) => showDrafts || n.reviewed).sort((a, b) => a.urutan - b.urutan);
  return {
    nodes: visible,
    fase: FASE_LIST.map((f) => ({ ...f, nodes: visible.filter((n) => n.fase === f.fase) })),
  };
}

const AYAT_RE = /^(\d{1,3}):(\d{1,3})$/;

// Tautan ke rujukan ayat. Hanya tautan, tanpa teks ayat, sampai sumber teks disetujui ustadz.
export function ayatUrl(rujukan: string): string | null {
  const m = AYAT_RE.exec(rujukan.trim());
  if (!m) return null;
  const surah = Number(m[1]);
  const ayat = Number(m[2]);
  if (surah < 1 || surah > 114 || ayat < 1) return null;
  return `https://quran.com/${surah}/${ayat}`;
}
