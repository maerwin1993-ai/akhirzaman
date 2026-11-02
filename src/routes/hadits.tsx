import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/hadits")({
  head: () => ({
    meta: [
      { title: "Hadits — akhirzaman.id" },
      { name: "description", content: "Hadits di akhirzaman.id, platform edukasi hadits shahih akhir zaman." },
      { property: "og:title", content: "Hadits — akhirzaman.id" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:description", content: "Hadits di akhirzaman.id, platform edukasi hadits shahih akhir zaman." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return <ComingSoon title={t.nav.hadith} />;
}
