import { useEffect, useRef } from "react";
import sunrise from "@/assets/orbital-sunrise.webp.asset.json";

export function HeroSunriseBackground() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = ref.current;
    const hero = image?.closest("section");
    if (!image || !hero) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = hero.getBoundingClientRect().height;
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / height));
      image.style.setProperty("--hero-drift", `${motion.matches ? 0 : progress * -2}%`);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <>
      <img
        ref={ref}
        src={sunrise.url}
        width={1920}
        height={1081}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        loading="eager"
        className="hero-sunrise pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom opacity-50 mix-blend-screen"
      />
      <div className="hero-readability pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-bottom-fade pointer-events-none absolute inset-0" aria-hidden="true" />
    </>
  );
}