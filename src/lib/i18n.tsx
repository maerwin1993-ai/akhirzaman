import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "id" | "en";

const dict = {
  id: {
    nav: { home: "Beranda", hadith: "Hadits", news: "Kabar Terkini", timeline: "Timeline", support: "Dukung Kami" },
    tagline: "Kabar dari Sabda Nabi ﷺ",
    hero: {
      eyebrow: "Platform Edukasi Hadits Shahih",
      title: "Kabar dari Sabda Nabi",
      subtitle:
        "Mengumpulkan hadits-hadits shahih tentang tanda-tanda akhir zaman, penjelasan para ulama salaf, dan relevansinya dengan kejadian di dunia saat ini.",
      cta1: "Jelajahi Hadits",
      cta2: "Lihat Timeline",
      featured: "Hadits Pilihan",
    },
    status: { done: "Sudah Terjadi", ongoing: "Sedang Berlangsung", future: "Belum Terjadi" },
    map: {
      title: "Peta Tanda Kiamat",
      desc: "Ringkasan tanda-tanda kiamat berdasarkan hadits shahih. Arahkan kursor, klik, dan pelajari satu per satu.",
      cta: "Jelajahi Peta",
    },
    news: { title: "Kabar Terkini", desc: "Peristiwa di dunia yang relevan dengan tema hadits.", all: "Lihat Semua Kabar", reviewed: "Ditinjau Dewan Syariah" },
    zoom: { title: "Zoom Waktu: Dari Awal Penciptaan hingga Akhirat", desc: "Jelajahi perjalanan besar manusia: dari Nabi Adam hingga kehidupan akhirat.", cta: "Jelajahi Timeline", here: "Kita di Sini" },
    support: { title: "Dukung Dakwah Ilmiah Ini", desc: "Bantu kami menghadirkan konten yang shahih, terverifikasi, dan bermanfaat bagi umat.", cta: "Infaq Sekarang" },
    footer: {
      about: "Platform edukasi hadits shahih tentang tanda-tanda akhir zaman, sesuai pemahaman Ahlus Sunnah wal Jama'ah.",
      disclaimer: "Kami tidak menentukan waktu kiamat dan tidak menunjuk individu tertentu sebagai Mahdi atau Dajjal.",
    },
    soon: "Halaman ini sedang disiapkan.",
    back: "Kembali ke Beranda",
  },
  en: {
    nav: { home: "Home", hadith: "Hadith", news: "Latest News", timeline: "Timeline", support: "Support Us" },
    tagline: "Tidings from the Prophet's ﷺ Words",
    hero: {
      eyebrow: "Authentic Hadith Education Platform",
      title: "Tidings from the Prophet's Words",
      subtitle:
        "Collecting authentic hadith on the signs of the end times, explanations of the early scholars, and their relevance to world events today.",
      cta1: "Explore Hadith",
      cta2: "View Timeline",
      featured: "Featured Hadith",
    },
    status: { done: "Already Happened", ongoing: "Happening Now", future: "Not Yet" },
    map: {
      title: "Map of the Signs",
      desc: "A summary of the signs of the Hour based on authentic hadith. Hover, click, and learn them one by one.",
      cta: "Explore the Map",
    },
    news: { title: "Latest News", desc: "World events relevant to hadith themes.", all: "See All News", reviewed: "Reviewed by Sharia Board" },
    zoom: { title: "Time Zoom: From Creation to the Hereafter", desc: "Explore humanity's great journey: from Prophet Adam to the life hereafter.", cta: "Explore Timeline", here: "We Are Here" },
    support: { title: "Support This Scholarly Dakwah", desc: "Help us deliver content that is authentic, verified, and beneficial to the ummah.", cta: "Donate Now" },
    footer: {
      about: "An educational platform of authentic hadith on the signs of the end times, following Ahlus Sunnah wal Jama'ah.",
      disclaimer: "We do not determine the time of the Hour and do not identify any individual as the Mahdi or the Dajjal.",
    },
    soon: "This page is being prepared.",
    back: "Back to Home",
  },
} as const;

type Dict = (typeof dict)["id"];
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({ lang: "id", setLang: () => {}, t: dict.id });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("id");
  return <Ctx.Provider value={{ lang, setLang, t: dict[lang] as Dict }}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);
export type L10n = { id: string; en: string };
