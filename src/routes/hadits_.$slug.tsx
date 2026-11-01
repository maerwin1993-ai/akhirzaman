import { createFileRoute, notFound } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";
import { signs } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/hadits_/$slug")({
  loader: ({ params }) => {
    const sign = signs.find((s) => s.slug === params.slug);
    if (!sign) throw notFound();
    return { sign };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.sign.name.id ?? "Tanda Kiamat"} — akhirzaman.id` },
      { name: "description", content: "Detail tanda kiamat berdasarkan hadits shahih." },
      { property: "og:title", content: `${loaderData?.sign.name.id ?? "Tanda Kiamat"} — akhirzaman.id` },
      { property: "og:description", content: "Detail tanda kiamat berdasarkan hadits shahih." },
    ],
  }),
  component: Page,
});

function Page() {
  const { sign } = Route.useLoaderData();
  const { lang } = useI18n();
  return <ComingSoon title={sign.name[lang]} />;
}
