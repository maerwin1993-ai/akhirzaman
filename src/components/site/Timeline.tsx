import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import {
  KITA_DI_SINI_NODE_ID,
  ayatUrl,
  getVisibleTimeline,
  type Dalil,
  type TimelineNode,
} from "@/lib/timeline-data";

function DalilItem({ dalil }: { dalil: Dalil }) {
  const { t } = useI18n();
  if (dalil.jenis === "hadis") {
    return (
      <li>
        <Link to="/hadits/$code" params={{ code: dalil.code }} className="text-dawn hover:underline">
          {t.timeline.hadis} {dalil.code} · {t.timeline.openHadis}
        </Link>
      </li>
    );
  }
  const url = ayatUrl(dalil.rujukan);
  return (
    <li>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-dawn hover:underline">
          {t.timeline.ayat} {dalil.rujukan} · {t.timeline.openAyat}
        </a>
      ) : (
        <span>
          {t.timeline.ayat} {dalil.rujukan}
        </span>
      )}
    </li>
  );
}

function NodeDetail({ node, onClose }: { node: TimelineNode; onClose: () => void }) {
  const { lang, t } = useI18n();
  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border bg-card p-6" role="region" aria-live="polite">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-3xl">{lang === "en" ? node.judul_en : node.judul_id}</h3>
        <button type="button" onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">
          {t.timeline.close}
        </button>
      </div>
      {!node.reviewed && (
        <p className="mt-2 inline-block rounded-full border border-mist px-3 py-0.5 text-xs text-muted-foreground">
          {t.timeline.draft}
        </p>
      )}
      <p className="mt-4 text-muted-foreground">{node.ringkasan}</p>
      <h4 className="mt-6 text-sm font-medium">{t.timeline.dalil}</h4>
      {node.dalil.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">{t.timeline.noDalil}</p>
      ) : (
        <ul className="mt-2 space-y-1 text-sm">
          {node.dalil.map((d, i) => (
            <DalilItem key={i} dalil={d} />
          ))}
        </ul>
      )}
    </div>
  );
}

export function Timeline() {
  const { lang, t } = useI18n();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Draf hanya terlihat saat pengembangan; di produksi hanya node reviewed:true.
  const showDrafts = import.meta.env.DEV;
  const { nodes, fase } = getVisibleTimeline(undefined, { showDrafts });
  const selected = nodes.find((n) => n.id === selectedId) ?? null;
  const skeletonOnly = nodes.length === 0;

  return (
    <section className="relative overflow-hidden bg-horizon pb-20 pt-28">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      <div className="relative mx-auto max-w-6xl px-5">
        <h1 className="font-display text-5xl sm:text-6xl">{t.timeline.title}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{t.timeline.desc}</p>
        {skeletonOnly && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.timeline.skeletonNote}</p>}
        {showDrafts && !skeletonOnly && <p className="mt-2 max-w-2xl text-sm text-dawn">{t.timeline.draftNote}</p>}
      </div>

      <div className="relative mx-auto mt-14 max-w-6xl px-5">
        <p className="mb-4 hidden text-xs text-muted-foreground md:block">{t.timeline.scrollHint}</p>
        <ol
          className="flex flex-col gap-10 md:snap-x md:snap-mandatory md:flex-row md:gap-0 md:overflow-x-auto md:pb-6"
          aria-label={t.timeline.title}
        >
          {fase.map((f) => (
            <li key={f.fase} className="md:min-w-72 md:shrink-0 md:snap-start md:pr-8">
              <div className="relative border-l border-border pl-6 md:border-l-0 md:border-t md:pl-0 md:pt-6">
                <span
                  className={`absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full border-2 md:-top-[8px] md:left-0 ${
                    f.nodes.length > 0 ? "border-dawn bg-dawn" : "border-mist bg-background"
                  }`}
                />
                <h2 className="font-display text-2xl">{lang === "en" ? f.judul_en : f.judul_id}</h2>
                <ul className="mt-4 space-y-3">
                  {f.nodes.map((n) => {
                    const here = n.id === KITA_DI_SINI_NODE_ID; // node sudah tersaring: hanya yang boleh tampil
                    return (
                      <li key={n.id}>
                        {here && (
                          <span className="mb-1 inline-block rounded-full bg-dawn px-3 py-1 text-xs font-medium text-ink motion-safe:animate-soft-pulse">
                            {t.zoom.here}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedId(n.id === selectedId ? null : n.id)}
                          aria-expanded={n.id === selectedId}
                          className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                            n.id === selectedId
                              ? "border-dawn bg-card"
                              : "border-border hover:border-mist"
                          }`}
                        >
                          {lang === "en" ? n.judul_en : n.judul_id}
                          {!n.reviewed && <span className="ml-2 text-xs text-muted-foreground">· {t.timeline.draft}</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        {selected && <NodeDetail node={selected} onClose={() => setSelectedId(null)} />}
      </div>
    </section>
  );
}
