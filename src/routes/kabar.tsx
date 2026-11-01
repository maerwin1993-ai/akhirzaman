import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/kabar")({
  head: () => ({
    meta: [
      { title: "Kabar Terkini — akhirzaman.id" },
      { name: "description", content: "Kabar Terkini di akhirzaman.id, platform edukasi hadits shahih akhir zaman." },
      { property: "og:title", content: "Kabar Terkini — akhirzaman.id" },
      { property: "og:description", content: "Kabar Terkini di akhirzaman.id, platform edukasi hadits shahih akhir zaman." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return <ComingSoon title={t.nav.news} />;
}
