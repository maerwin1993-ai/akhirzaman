import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function ComingSoon({ title }: { title: string }) {
  const { t } = useI18n();
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-horizon">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      <div className="relative mx-auto max-w-3xl px-5 pt-24 text-center">
        <h1 className="font-display text-5xl sm:text-6xl">{title}</h1>
        <p className="mt-4 text-muted-foreground">{t.soon}</p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">{t.back}</Link>
      </div>
    </section>
  );
}
