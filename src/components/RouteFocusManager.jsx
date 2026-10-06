import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteFocusManager() {
  const { pathname, hash, key, state } = useLocation();

  useEffect(() => {
    if (state?.preserveScroll) return;
    if (hash) {
      let target = null;

      try {
        target = document.querySelector(hash);
      } catch {
        target = null;
      }

      if (target) {
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        const needsTemporaryTabIndex = !target.matches(
          'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]'
        );

        if (needsTemporaryTabIndex) target.setAttribute('tabindex', '-1');
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        const frame = window.requestAnimationFrame(() => {
          target.focus({ preventScroll: true });
        });

        return () => {
          window.cancelAnimationFrame(frame);
          if (needsTemporaryTabIndex) target.removeAttribute('tabindex');
        };
      }
    }

    window.scrollTo({ top: 0 });
    const frame = window.requestAnimationFrame(() => {
      document.querySelector('#main-content')?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, key, state?.preserveScroll]);

  return null;
}
