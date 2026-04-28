import { useEffect } from 'react';

export function useLenis() {
  useEffect(() => {
    let lenis;
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 0.8,                              // was 1.4 — snappier feel
        easing: (t) => 1 - Math.pow(1 - t, 3),     // simpler cubic ease-out
        smooth: true,
        smoothTouch: false,
        syncTouch: false,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
      });

      let rafId;
      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      return () => cancelAnimationFrame(rafId);
    }).catch(() => {});

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);
}
