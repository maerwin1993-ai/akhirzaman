import type { L10n } from "./i18n";

export type SignStatus = "done" | "ongoing" | "future";

export type Sign = { slug: string; name: L10n; status: SignStatus; x: number; y: number; summary: L10n };

// [DUMMY] positions are % of the constellation canvas
export const signs: Sign[] = [
  { slug: "diutusnya-nabi", name: { id: "Diutusnya Nabi ﷺ", en: "The Prophet's Mission ﷺ" }, status: "done", x: 8, y: 70, summary: { id: "[DUMMY] Ringkasan tanda.", en: "[DUMMY] Sign summary." } },
  { slug: "terbelahnya-bulan", name: { id: "Terbelahnya Bulan", en: "Splitting of the Moon" }, status: "done", x: 20, y: 48, summary: { id: "[DUMMY] Ringkasan tanda.", en: "[DUMMY] Sign summary." } },
  { slug: "bangunan-tinggi", name: { id: "Berlomba Bangunan Tinggi", en: "Competing in Tall Buildings" }, status: "ongoing", x: 34, y: 62, summary: { id: "[DUMMY] Ringkasan tanda.", en: "[DUMMY] Sign summary." } },
  { slug: "meluasnya-riba", name: { id: "Meluasnya Riba", en: "Spread of Usury" }, status: "ongoing", x: 44, y: 32, summary: { id: "[DUMMY] Ringkasan tanda.", en: "[DUMMY] Sign summary." } },
  { slug: "banyaknya-gempa", name: { id: "Banyaknya Gempa Bumi", en: "Frequent Earthquakes" }, status: "ongoing", x: 55, y: 66, summary: { id: "[DUMMY] Ringkasan tanda.", en: "[DUMMY] Sign summary." } },
  { slug: "imam-mahdi", name: { id: "Datangnya Al-Mahdi", en: "Coming of Al-Mahdi" }, status: "future", x: 66, y: 40, summary: { id: "[DUMMY] Ringkasan tanda.", en: "[DUMMY] Sign summary." } },
  { slug: "fitnah-dajjal", name: { id: "Fitnah Dajjal", en: "Trial of the Dajjal" }, status: "future", x: 76, y: 22, summary: { id: "[DUMMY] Ringkasan tanda.", en: "[DUMMY] Sign summary." } },
  { slug: "turunnya-isa", name: { id: "Turunnya Nabi Isa", en: "Descent of Jesus" }, status: "future", x: 84, y: 54, summary: { id: "[DUMMY] Ringkasan tanda.", en: "[DUMMY] Sign summary." } },
  { slug: "keluarnya-dabbah", name: { id: "Keluarnya Dabbah", en: "Emergence of the Beast" }, status: "future", x: 93, y: 76, summary: { id: "[DUMMY] Ringkasan tanda.", en: "[DUMMY] Sign summary." } },
];

export const timeline: { label: L10n; sub?: L10n; here?: boolean }[] = [
  { label: { id: "Nabi Adam", en: "Prophet Adam" }, sub: { id: "awal penciptaan", en: "creation" } },
  { label: { id: "Para Nabi & Rasul", en: "Prophets & Messengers" } },
  { label: { id: "Nabi Muhammad ﷺ", en: "Prophet Muhammad ﷺ" } },
  { label: { id: "Tanda Kecil", en: "Minor Signs" } },
  { label: { id: "Tanda Besar", en: "Major Signs" }, here: true },
  { label: { id: "Sangkakala", en: "The Trumpet" } },
  { label: { id: "Akhirat", en: "Hereafter" }, sub: { id: "Barzakh – Surga/Neraka", en: "Barzakh – Paradise/Hell" } },
];
