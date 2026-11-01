import { Link } from "@tanstack/react-router";
import { BookOpen, Globe, HandHeart, Home, Hourglass, Newspaper } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

export function Logo() {
  const { t } = useI18n();
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <svg viewBox="0 0 40 20" className="h-5 w-10 shrink-0 text-dawn" aria-hidden>
        <path d="M2 18 Q20 -6 38 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-lg font-semibold tracking-tight">akhirzaman.id</span>
        <span className="block truncate font-display text-xs italic text-muted-foreground">{t.tagline}</span>
      </span>
    </Link>
  );
}

export function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-1 rounded-full border border-border p-1 text-xs">
      <Globe className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
      {(["id", "en"] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)}
          className={`rounded-full px-2 py-0.5 uppercase transition-colors ${lang === l ? "bg-bone text-ink" : "text-muted-foreground hover:text-foreground"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

export function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [
    { to: "/", label: t.nav.home },
    { to: "/hadits", label: t.nav.hadith },
    { to: "/kabar", label: t.nav.news },
    { to: "/timeline", label: t.nav.timeline },
  ] as const;
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${scrolled ? "border-b border-border bg-background/70 backdrop-blur-xl" : ""}`}>
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 md:flex md:justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: true }}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-dawn">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitch />
          <Link to="/dukung" className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-shadow hover:shadow-glow sm:inline-flex">
            {t.nav.support}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { t } = useI18n();
  const items = [
    { to: "/", label: t.nav.home, icon: Home },
    { to: "/hadits", label: t.nav.hadith, icon: BookOpen },
    { to: "/kabar", label: t.nav.news, icon: Newspaper },
    { to: "/timeline", label: t.nav.timeline, icon: Hourglass },
    { to: "/dukung", label: t.nav.support, icon: HandHeart },
  ] as const;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: true }}
            className="flex flex-col items-center gap-1 py-2.5 text-[10px] text-muted-foreground data-[status=active]:text-dawn">
            <Icon className="h-5 w-5" strokeWidth={1.5} />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border pb-24 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
        <Logo />
        <div className="space-y-2 text-sm text-muted-foreground md:text-right">
          <p>{t.footer.about}</p>
          <p className="text-xs italic">{t.footer.disclaimer}</p>
          <p className="text-xs">© 2026 akhirzaman.id</p>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grain min-h-screen">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
