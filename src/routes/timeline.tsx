import { createFileRoute } from "@tanstack/react-router";
import { Timeline } from "@/components/site/Timeline";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline — akhirzaman.id" },
      { name: "description", content: "Timeline di akhirzaman.id, platform edukasi hadits shahih akhir zaman." },
      { property: "og:title", content: "Timeline — akhirzaman.id" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:description", content: "Timeline di akhirzaman.id, platform edukasi hadits shahih akhir zaman." },
    ],
  }),
  component: Page,
});

function Page() {
  return <Timeline />;
}
