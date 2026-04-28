import { useEffect } from 'react';

export function useLenis() {
  useEffect(() => {
    // Dynamic import so SSR / non-lenis environments don't break
    let lenis;
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }).catch(() => {
      // Graceful fallback — native scroll
    });

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);
}
