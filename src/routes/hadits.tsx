import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  Link,
  createFileRoute,
  useNavigate,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DerajatBadge, HadithStatusBadge } from "@/components/site/HadithStatusBadge";
import { HADITH_STATUS, KATEGORI } from "@/lib/hadiths.functions";
import { hadithKitabQuery, hadithListQuery } from "@/lib/hadiths.queries";
import { useI18n } from "@/lib/i18n";

type HadithSearch = {
  q: string;
  kategori: string;
  status: string;
  kitab: string;
  sign: string;
  page: number;
};

const asStr = (v: unknown) => (typeof v === "string" ? v : "");

export const Route = createFileRoute("/hadits")({
  validateSearch: (search: Record<string, unknown>): HadithSearch => ({
    q: asStr(search.q).slice(0, 120),
    kategori: asStr(search.kategori),
    status: asStr(search.status),
    kitab: asStr(search.kitab),
    sign: asStr(search.sign),
    page: Math.max(1, Math.floor(Number(search.page) || 1)),
  }),
  loaderDeps: ({ search }) => ({
    q: search.q,
    kategori: search.kategori,
    status: search.status,
    kitab: search.kitab,
    sign: search.sign,
    page: search.page,
  }),
  loader: ({ context, deps }) =>
    Promise.all([
      context.queryClient.ensureQueryData(hadithListQuery(deps)),
      context.queryClient.ensureQueryData(hadithKitabQuery),
    ]),
  head: () => ({
    meta: [
      { title: "Perpustakaan Hadits — akhirzaman.id" },
      {
        name: "description",
        content:
          "Cari dan saring hadits shahih tentang tanda-tanda akhir zaman berdasarkan kitab, kategori, dan status.",
      },
      { property: "og:title", content: "Perpustakaan Hadits — akhirzaman.id" },
      {
        property: "og:description",
        content:
          "Cari dan saring hadits shahih tentang tanda-tanda akhir zaman berdasarkan kitab, kategori, dan status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HadithLibrary,
  errorComponent: HadithListError,
  notFoundComponent: HadithListError,
});

function HadithListError({ error, reset }: ErrorComponentProps) {
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

function SearchBox({ value, onSubmit }: { value: string; onSubmit: (v: string) => void }) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    if (draft === value) return;
    const id = setTimeout(() => onSubmit(draft), 400);
    return () => clearTimeout(id);
  }, [draft, value, onSubmit]);

  return (
    <div className="glass relative flex items-center gap-3 rounded-2xl px-4 py-3.5">
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={t.hadith.searchPlaceholder}
        aria-label={t.hadith.searchPlaceholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      {draft && (
        <button
          type="button"
          onClick={() => {
            setDraft("");
            onSubmit("");
          }}
          aria-label={t.hadith.clear}
          className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function ChipRow({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onSelect: (v: string) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <button
        type="button"
        onClick={() => onSelect("")}
        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
          value === ""
            ? "border-dawn bg-dawn text-ink"
            : "border-border text-muted-foreground hover:border-dawn/60 hover:text-foreground"
        }`}
      >
        {t.hadith.all}
      </button>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onSelect(value === o.value ? "" : o.value)}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            value === o.value
              ? "border-dawn bg-dawn text-ink"
              : "border-border text-muted-foreground hover:border-dawn/60 hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function pageWindow(current: number, total: number): number[] {
  const from = Math.max(1, Math.min(current - 2, total - 4));
  const to = Math.min(total, Math.max(current + 2, 5));
  const out: number[] = [];
  for (let p = from; p <= to; p += 1) out.push(p);
  return out;
}

function HadithLibrary() {
  const { t, lang } = useI18n();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/hadits" });
  const queryClient = useQueryClient();
  const { data, isPlaceholderData, isFetching } = useSuspenseQuery(hadithListQuery(search));
  const { data: kitabOptions } = useSuspenseQuery(hadithKitabQuery);

  const setParams = (patch: Partial<HadithSearch>) =>
    navigate({
      search: (prev) => ({ ...prev, page: 1, ...patch }),
      replace: true,
    });

  const hasFilters = Boolean(search.q || search.kategori || search.status || search.kitab || search.sign);
  const signLabel = search.sign ? search.sign.replace(/[-_]/g, " ") : "";

  const kategoriOptions = KATEGORI.map((k) => ({
    value: k,
    label: t.hadith.kategori[k as keyof typeof t.hadith.kategori],
  }));
  const statusOptions = HADITH_STATUS.map((s) => ({
    value: s,
    label: t.hadith.status[s as keyof typeof t.hadith.status],
  }));
  const kitabItems = kitabOptions.map((k) => ({ value: k, label: k }));

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t.nav.hadith}</p>
        <h1 className="font-display mt-3 text-4xl sm:text-5xl">{t.hadith.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.hadith.desc}</p>
      </header>

      <div className="mt-9 grid gap-5 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <div className="glass grid gap-4 rounded-2xl p-5">
          <SearchBox value={search.q} onSubmit={(q) => setParams({ q })} />
          <ChipRow
            label={t.hadith.byKategori}
            options={kategoriOptions}
            value={search.kategori}
            onSelect={(kategori) => setParams({ kategori })}
          />
          <ChipRow
            label={t.hadith.byStatus}
            options={statusOptions}
            value={search.status}
            onSelect={(status) => setParams({ status })}
          />
          {kitabItems.length > 0 && (
            <ChipRow
              label={t.hadith.byKitab}
              options={kitabItems}
              value={search.kitab}
              onSelect={(kitab) => setParams({ kitab })}
            />
          )}
          {signLabel && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-20 shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {t.hadith.relatedSigns}
              </span>
              <button
                type="button"
                onClick={() => setParams({ sign: "" })}
                className="inline-flex items-center gap-1.5 rounded-full border border-dawn bg-dawn/15 px-3 py-1 text-xs text-dawn"
              >
                {signLabel}
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {hasFilters && (
            <button
              type="button"
              onClick={() => navigate({ search: { q: "", kategori: "", status: "", kitab: "", sign: "", page: 1 }, replace: true })}
              className="justify-self-start text-xs text-muted-foreground underline-offset-4 hover:text-dawn hover:underline"
            >
              {t.hadith.clear}
            </button>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{data.total}</span> {t.hadith.found}
            </p>
            {(isPlaceholderData || isFetching) && (
              <p className="animate-soft-pulse text-xs text-dawn">{t.hadith.loading}</p>
            )}
          </div>

          {data.items.length === 0 ? (
            <div className="glass mt-4 flex flex-col items-center rounded-2xl px-6 py-16 text-center">
              <Search className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              <h2 className="font-display mt-4 text-2xl">{t.hadith.emptyTitle}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t.hadith.emptyDesc}</p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => navigate({ search: { q: "", kategori: "", status: "", kitab: "", sign: "", page: 1 } })}
                  className="mt-6 rounded-full border border-bone/30 px-5 py-2 text-sm transition-colors hover:bg-bone/10"
                >
                  {t.hadith.clear}
                </button>
              )}
            </div>
          ) : (
            <ul className={`mt-4 grid gap-4 sm:grid-cols-2 ${isPlaceholderData ? "opacity-60" : ""}`}>
              {data.items.map((item) => (
                <li key={item.code}>
                  <Link
                    to="/hadits/$code"
                    params={{ code: item.code }}
                    className="glass group flex h-full flex-col rounded-2xl p-5 transition-colors hover:bg-card"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <HadithStatusBadge status={item.status} />
                      <DerajatBadge derajat={item.derajat} />
                    </div>
                    <h3 className="font-display mt-3 line-clamp-2 text-xl leading-snug group-hover:text-dawn">
                      {item.tema ?? item.code}
                    </h3>
                    <p className="arabic mt-3 line-clamp-2 text-lg leading-loose text-bone/80" dir="rtl">
                      {item.teks_arab}
                    </p>
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {(lang === "id" ? item.matan_ringkas_id : item.matan_ringkas_en) ??
                        item.matan_ringkas_id ??
                        item.matan_ringkas_en}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-muted-foreground">
                      <span>
                        {item.kitab}
                        {item.nomor ? ` no. ${item.nomor}` : ""}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {data.pages > 1 && (
            <nav className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => setParams({ page: data.page - 1 })}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:border-dawn/60 hover:text-foreground disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted-foreground"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> {t.hadith.prev}
              </button>
              {pageWindow(data.page, data.pages).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setParams({ page: p })}
                  aria-current={p === data.page ? "page" : undefined}
                  className={`h-8 w-8 rounded-full border text-xs transition-colors ${
                    p === data.page
                      ? "border-dawn bg-dawn text-ink"
                      : "border-border text-muted-foreground hover:border-dawn/60 hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={data.page >= data.pages}
                onClick={() => setParams({ page: data.page + 1 })}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:border-dawn/60 hover:text-foreground disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted-foreground"
              >
                {t.hadith.next} <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
