import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  Quote,
} from "lucide-react";
import { useState } from "react";
import { DerajatBadge, HadithStatusBadge } from "@/components/site/HadithStatusBadge";
import { hadithDetailQuery } from "@/lib/hadiths.queries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/hadits_/$code")({
  loader: ({ params, context }) => context.queryClient.ensureQueryData(hadithDetailQuery(params.code)),
  head: ({ loaderData }) => {
    const tema = loaderData?.tema;
    const title = `${tema ?? "Hadits"} — akhirzaman.id`;
    const description =
      loaderData?.matan_ringkas_id ??
      "Detail hadits shahih tentang tanda-tanda akhir zaman beserta penjelasan ulama dan sumbernya.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: HadithDetailPage,
  errorComponent: HadithDetailError,
  notFoundComponent: HadithNotFound,
});

function HadithNotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <BookOpen className="h-10 w-10 text-dawn" strokeWidth={1.5} />
      <h1 className="font-display mt-5 text-3xl">{t.hadith.notFound}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t.hadith.notFoundDesc}</p>
      <Link
        to="/hadits"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:shadow-glow"
      >
        {t.hadith.back}
      </Link>
    </div>
  );
}

function HadithDetailError({ error, reset }: ErrorComponentProps) {
  const { t } = useI18n();
  const router = useRouter();
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <BookOpen className="h-10 w-10 text-dawn" strokeWidth={1.5} />
      <h1 className="font-display mt-5 text-3xl">{t.hadith.errorTitle}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {error instanceof Error && error.message ? error.message : t.hadith.errorDesc}
      </p>
      <button
        onClick={() => {
          router.invalidate();
          reset();
        }}
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:shadow-glow"
      >
        {t.hadith.retry}
      </button>
    </div>
  );
}

function CopyButton({ label, getValue }: { label: string; getValue: () => string }) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(getValue());
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          setDone(false);
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-dawn/60 hover:text-foreground"
    >
      {done ? <Check className="h-3.5 w-3.5 text-dawn" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? t.hadith.copied : label}
    </button>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function HadithDetailPage() {
  const { t, lang } = useI18n();
  const { code } = Route.useParams();
  const hadith = useSuspenseQuery(hadithDetailQuery(code)).data;

  const [view, setView] = useState<"id" | "en">(lang);
  const translation = view === "id" ? hadith.terjemah_id : hadith.terjemah_en;
  const matan = (view === "id" ? hadith.matan_ringkas_id : hadith.matan_ringkas_en) ??
    hadith.matan_ringkas_id ??
    hadith.matan_ringkas_en;

  return (
    <article className="mx-auto max-w-4xl px-5 pb-24 pt-32">
      <Link
        to="/hadits"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-dawn"
      >
        <ArrowLeft className="h-4 w-4" /> {t.hadith.back}
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-border px-2 py-0.5 text-[11px] font-medium tracking-widest text-muted-foreground">
          {hadith.code}
        </span>
        <HadithStatusBadge status={hadith.status} />
        <DerajatBadge derajat={hadith.derajat} />
        {hadith.kategori && (
          <span className="rounded-md bg-dawn px-2 py-0.5 text-[11px] font-medium text-ink">
            {t.hadith.kategori[hadith.kategori as keyof typeof t.hadith.kategori] ?? hadith.kategori}
          </span>
        )}
      </div>

      <h1 className="font-display mt-5 text-3xl leading-tight sm:text-4xl">{hadith.tema ?? hadith.code}</h1>

      <section className="glass mt-8 rounded-2xl p-6 sm:p-8">
        <p className="arabic text-right text-xl leading-[2] text-bone sm:text-[22px]" dir="rtl">
          {hadith.teks_arab}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-full border border-border p-1">
            {(["id", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setView(l)}
                className={`rounded-full px-3 py-1 text-xs uppercase transition-colors ${
                  view === l ? "bg-dawn text-ink" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton label={t.hadith.copyText} getValue={() => `${hadith.teks_arab}\n\n${translation ?? ""}`} />
            <CopyButton label={t.hadith.copyLink} getValue={() => window.location.href} />
          </div>
        </div>

        {translation && <p className="mt-5 text-base leading-[1.8] text-foreground sm:text-[17px]">{translation}</p>}
        {matan && (
          <div className="mt-6 border-t border-border pt-5">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t.hadith.matan}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{matan}</p>
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display flex items-center gap-2 text-xl">
            <Quote className="h-4 w-4 text-dawn" strokeWidth={1.5} /> {t.hadith.syarah}
          </h2>
          {hadith.syarah_ringkas ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{hadith.syarah_ringkas}</p>
          ) : (
            <p className="mt-3 text-sm italic text-muted-foreground">{t.hadith.noSyarah}</p>
          )}
          {hadith.rujukan_syarah && (
            <p className="mt-4 text-xs text-muted-foreground">
              {t.hadith.rujukan}: <span className="text-foreground">{hadith.rujukan_syarah}</span>
            </p>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-xl">{t.hadith.source}</h2>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label={t.hadith.byKitab} value={hadith.kitab} />
            <Field label={t.hadith.nomor} value={hadith.nomor} />
            <Field label={t.hadith.bab} value={hadith.bab} />
            <Field label={t.hadith.jenis} value={hadith.jenis} />
            <Field label={t.hadith.penilai} value={hadith.penilai_derajat} />
          </dl>
          {hadith.verified_by && (
            <p className="mt-4 text-xs text-muted-foreground">
              {t.news.reviewed}: <span className="text-foreground">{hadith.verified_by}</span>
            </p>
          )}
          {hadith.link_sumber && (
            <a
              href={hadith.link_sumber}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-dawn hover:underline"
            >
              {t.hadith.openSource} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </section>

      {hadith.signs.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl">{t.hadith.relatedSigns}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {hadith.signs.map((s) => (
              <Link
                key={s.slug}
                to="/hadits"
                search={{ sign: s.slug }}
                className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-dawn/60 hover:text-dawn"
              >
                {s.nama}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
