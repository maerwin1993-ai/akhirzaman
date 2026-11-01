import { createFileRoute } from "@tanstack/react-router";
import { Hero, LatestNews, SignMap, SupportBanner, TimeZoom } from "@/components/site/HomeSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "akhirzaman.id — Kabar dari Sabda Nabi ﷺ" },
      { name: "description", content: "Platform edukasi hadits shahih tentang tanda-tanda akhir zaman dan relevansinya dengan kejadian dunia saat ini." },
      { property: "og:title", content: "akhirzaman.id — Kabar dari Sabda Nabi ﷺ" },
      { property: "og:description", content: "Hadits shahih tentang tanda-tanda akhir zaman, penjelasan ulama salaf, dan kabar terkini." },
    ],
  }),
  component: Index,
});

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
