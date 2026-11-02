import { createFileRoute, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { Hero, LatestNews, SignMap, SupportBanner, TimeZoom } from "@/components/site/HomeSections";
import { homeHadithQuery } from "@/lib/hadiths.queries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(homeHadithQuery),
  head: () => ({
    meta: [
      { title: "akhirzaman.id — Kabar dari Sabda Nabi ﷺ" },
      {
        name: "description",
        content:
          "Platform edukasi hadits shahih tentang tanda-tanda akhir zaman dan relevansinya dengan kejadian dunia saat ini.",
      },
      { property: "og:title", content: "akhirzaman.id — Kabar dari Sabda Nabi ﷺ" },
      {
        property: "og:description",
        content: "Hadits shahih tentang tanda-tanda akhir zaman, penjelasan ulama salaf, dan kabar terkini.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
  errorComponent: HomeError,
  notFoundComponent: HomeError,
});

function HomeError({ error, reset }: ErrorComponentProps) {
  const { t } = useI18n();
  const router = useRouter();
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <h1 className="font-display text-3xl">{t.hadith.errorTitle}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {error instanceof Error && error.message ? error.message : t.hadith.errorDesc}
      </p>
      <button
        onClick={() => {
          router.invalidate();
          reset();
        }}
        className="mt-7 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:shadow-glow"
      >
        {t.hadith.retry}
      </button>
    </div>
  );
}

function Index() {
  return (
    <>
      <Hero />
      <SignMap />
      <LatestNews />
      <TimeZoom />
      <SupportBanner />
    </>
  );
}
