import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline — akhirzaman.id" },
      { name: "description", content: "Timeline di akhirzaman.id, platform edukasi hadits shahih akhir zaman." },
      { property: "og:title", content: "Timeline — akhirzaman.id" },
      { property: "og:description", content: "Timeline di akhirzaman.id, platform edukasi hadits shahih akhir zaman." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return <ComingSoon title={t.nav.timeline} />;
}
