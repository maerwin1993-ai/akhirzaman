import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/dukung")({
  head: () => ({
    meta: [
      { title: "Dukung Kami — akhirzaman.id" },
      { name: "description", content: "Dukung Kami di akhirzaman.id, platform edukasi hadits shahih akhir zaman." },
      { property: "og:title", content: "Dukung Kami — akhirzaman.id" },
      { property: "og:description", content: "Dukung Kami di akhirzaman.id, platform edukasi hadits shahih akhir zaman." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return <ComingSoon title={t.nav.support} />;
}
