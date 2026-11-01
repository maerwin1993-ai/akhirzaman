import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, ChevronDown, HandHeart, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { signs, timeline, type SignStatus } from "@/lib/data";
import { ShaderBackground } from "./ShaderBackground";
import { StatusBadge } from "./StatusBadge";
import drought from "@/assets/news-drought.jpg";
import economy from "@/assets/news-economy.jpg";
import social from "@/assets/news-social.jpg";
import tech from "@/assets/news-tech.jpg";

function RevealText({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span aria-label={text}>
      {text.split(" ").map((word, wi, arr) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
          {[...word].map((ch, ci) => {
            const idx = arr.slice(0, wi).join(" ").length + ci;
            return <span key={ci} className="animate-letter inline-block" style={{ animationDelay: `${delay + idx * 45}ms` }}>{ch}</span>;
          })}
          {wi < arr.length - 1 && "\u00a0"}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const { t, lang } = useI18n();
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <ShaderBackground />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 pb-24 pt-32 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <p className="animate-fade-up text-xs uppercase tracking-[0.3em] text-muted-foreground">{t.hero.eyebrow}</p>
          <h1 key={lang} className="font-display mt-6 text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
            <RevealText text={t.hero.title} delay={200} /> <span className="text-dawn">ﷺ</span>
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-base text-muted-foreground sm:text-lg" style={{ animationDelay: "1.2s" }}>{t.hero.subtitle}</p>
          <div className="animate-fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: "1.6s" }}>
            <Link to="/hadits" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-shadow duration-500 hover:shadow-glow">
              {t.hero.cta1} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/timeline" className="inline-flex items-center gap-2 rounded-full border border-bone/30 px-6 py-3 font-medium transition-colors duration-500 hover:bg-bone/10">
              {t.hero.cta2}
            </Link>
          </div>
        </div>
        <article className="glass animate-fade-up shadow-card rounded-2xl p-8" style={{ animationDelay: "1.9s" }}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">{t.hero.featured}</span>
            <StatusBadge status="future" />
          </div>
          <p className="arabic mt-6 text-3xl sm:text-4xl">لَا تَقُومُ السَّاعَةُ حَتَّى تَكُونَ عَشْرُ آيَاتٍ …</p>
          <p className="font-display mt-6 text-xl italic">
            {lang === "id" ? "“[DUMMY] Tidak akan terjadi kiamat hingga muncul sepuluh tanda …”" : "“[DUMMY] The Hour will not come until ten signs appear …”"}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">[DUMMY] HR. Muslim no. 2901</p>
        </article>
      </div>
      <ChevronDown className="absolute bottom-8 left-1/2 h-6 w-6 -translate-x-1/2 text-muted-foreground" />
    </section>
  );
}

const nodeStyle: Record<SignStatus, string> = {
  done: "h-3.5 w-3.5 bg-bone shadow-[0_0_16px_4px_var(--bone)]",
  ongoing: "h-4 w-4 bg-dawn shadow-glow animate-soft-pulse",
  future: "h-3 w-3 border border-mist bg-background",
};

export function SignMap() {
  const { t, lang } = useI18n();
  const [hover, setHover] = useState<string | null>(null);
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_2.2fr] lg:items-center">
        <div>
          <h2 className="font-display text-4xl sm:text-5xl">{t.map.title}</h2>
          <p className="mt-4 text-muted-foreground">{t.map.desc}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <StatusBadge status="done" /><StatusBadge status="ongoing" /><StatusBadge status="future" />
          </div>
          <Link to="/hadits" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:shadow-glow">
            {t.map.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-[radial-gradient(ellipse_at_60%_120%,var(--dusk),transparent_60%)]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {signs.slice(1).map((s, i) => {
              const p = signs[i]!;
              return <line key={s.slug} x1={p.x} y1={p.y} x2={s.x} y2={s.y} vectorEffect="non-scaling-stroke"
                stroke="var(--bone)" strokeOpacity={s.status === "future" ? 0.15 : 0.4} strokeWidth="1" strokeDasharray={s.status === "future" ? "3 4" : undefined} />;
            })}
          </svg>
          {signs.map((s) => (
            <Link key={s.slug} to="/hadits/$slug" params={{ slug: s.slug }}
              onMouseEnter={() => setHover(s.slug)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(s.slug)} onBlur={() => setHover(null)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 p-3" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
              <span className={`block rounded-full transition-transform duration-500 group-hover:scale-150 ${nodeStyle[s.status]}`} />
              <span className="pointer-events-none absolute left-1/2 top-full hidden -translate-x-1/2 whitespace-nowrap text-[11px] text-muted-foreground sm:block">{s.name[lang]}</span>
              {hover === s.slug && (
                <span className="glass animate-fade-up absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-xl bg-card/90 p-3 text-left" style={{ animationDuration: ".5s" }}>
                  <span className="block text-sm font-medium text-foreground">{s.name[lang]}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{s.summary[lang]}</span>
                  <span className="mt-2 block"><StatusBadge status={s.status} /></span>
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const news = [
  { img: drought, cat: { id: "Lingkungan", en: "Environment" }, title: { id: "[DUMMY] Kekeringan Meluas di Beberapa Negara", en: "[DUMMY] Drought Spreads Across Several Countries" }, sum: { id: "[DUMMY] Peningkatan suhu global dan kekeringan ekstrem terjadi di sejumlah wilayah, relevan dengan hadits tentang berkurangnya keberkahan.", en: "[DUMMY] Rising global temperatures and extreme drought in many regions, relevant to hadith on diminishing blessings." }, date: "28 Okt 2026" },
  { img: economy, cat: { id: "Ekonomi", en: "Economy" }, title: { id: "[DUMMY] Ketimpangan Ekonomi Semakin Lebar", en: "[DUMMY] Economic Inequality Widens" }, sum: { id: "[DUMMY] Ringkasan berita.", en: "[DUMMY] News summary." }, date: "26 Okt 2026" },
  { img: social, cat: { id: "Sosial", en: "Social" }, title: { id: "[DUMMY] Pergeseran Moral di Masyarakat Modern", en: "[DUMMY] Moral Shifts in Modern Society" }, sum: { id: "[DUMMY] Ringkasan berita.", en: "[DUMMY] News summary." }, date: "24 Okt 2026" },
  { img: tech, cat: { id: "Teknologi", en: "Technology" }, title: { id: "[DUMMY] Penyebaran Informasi Palsu di Era AI", en: "[DUMMY] Misinformation in the AI Era" }, sum: { id: "[DUMMY] Ringkasan berita.", en: "[DUMMY] News summary." }, date: "20 Okt 2026" },
];

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-md bg-dawn px-2 py-0.5 text-[11px] font-medium text-ink">{children}</span>;
}

export function LatestNews() {
  const { t, lang } = useI18n();
  const main = news[0]!;
  const rest = news.slice(1);
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl sm:text-5xl">{t.news.title}</h2>
          <p className="mt-2 text-muted-foreground">{t.news.desc}</p>
        </div>
        <Link to="/kabar" className="inline-flex items-center gap-2 text-sm hover:text-dawn">{t.news.all} <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Link to="/kabar" className="group relative min-h-[420px] overflow-hidden rounded-2xl">
          <img src={main.img} alt="" width={1280} height={832} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-8">
            <Chip>{main.cat[lang]}</Chip>
            <h3 className="font-display mt-3 text-3xl sm:text-4xl">{main.title[lang]}</h3>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">{main.sum[lang]}</p>
            <Meta date={main.date} label={t.news.reviewed} />
          </div>
        </Link>
        <div className="grid gap-4">
          {rest.map((n) => (
            <Link key={n.title.id} to="/kabar" className="glass group grid grid-cols-[96px_minmax(0,1fr)] gap-4 rounded-2xl p-3 transition-colors hover:bg-card">
              <img src={n.img} alt="" width={816} height={816} loading="lazy" className="h-24 w-24 rounded-xl object-cover" />
              <div className="min-w-0 py-1">
                <Chip>{n.cat[lang]}</Chip>
                <h3 className="mt-1.5 line-clamp-2 font-medium leading-snug group-hover:text-dawn">{n.title[lang]}</h3>
                <Meta date={n.date} label={t.news.reviewed} small />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Meta({ date, label, small }: { date: string; label: string; small?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground ${small ? "mt-1.5 text-[11px]" : "mt-5 text-xs"}`}>
      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{date}</span>
      <span className="inline-flex items-center gap-1 text-dawn"><ShieldCheck className="h-3.5 w-3.5" />{label}</span>
    </div>
  );
}

export function TimeZoom() {
  const { t, lang } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl sm:text-5xl">{t.zoom.title}</h2>
          <p className="mt-2 text-muted-foreground">{t.zoom.desc}</p>
        </div>
        <Link to="/timeline" className="inline-flex items-center gap-2 text-sm hover:text-dawn">{t.zoom.cta} <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="-mx-5 mt-12 overflow-x-auto px-5 pb-4">
        <ol className="relative flex min-w-[760px] justify-between pt-12">
          <span className="absolute left-0 right-0 top-[3.4rem] h-px bg-gradient-to-r from-mist/30 via-dawn to-mist/20" />
          {timeline.map((s) => (
            <li key={s.label.id} className="relative flex w-28 flex-col items-center text-center">
              {s.here && (
                <span className="absolute -top-11 whitespace-nowrap rounded-full bg-dawn px-3 py-1 text-xs font-medium text-ink shadow-glow animate-soft-pulse">{t.zoom.here}</span>
              )}
              <span className={`relative z-10 block rounded-full border-2 ${s.here ? "h-5 w-5 border-dawn bg-dawn shadow-glow" : "h-3.5 w-3.5 border-dawn bg-background"}`} />
              <span className="mt-4 text-sm font-medium">{s.label[lang]}</span>
              {s.sub && <span className="mt-1 text-[11px] text-muted-foreground">({s.sub[lang]})</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function SupportBanner() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-horizon px-8 py-12 sm:px-12">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <HandHeart className="mt-1 h-8 w-8 shrink-0 text-dawn" strokeWidth={1.5} />
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">{t.support.title}</h2>
              <p className="mt-2 max-w-lg text-muted-foreground">{t.support.desc}</p>
            </div>
          </div>
          <Link to="/dukung" className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:shadow-glow md:self-auto">
            {t.support.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
