import { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, as: Tag = 'div', className = '', delay = 0, onFocusCapture, ...rest }) {
  const ref = useRef(null);
  const [enhanced, setEnhanced] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setEnhanced(true);
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: '0px' }
    );
    const resetObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !el.contains(document.activeElement)) setVisible(false);
      },
      // Keep the reset boundary beyond the entrance travel to avoid edge flicker.
      { threshold: 0, rootMargin: '96px 0px' }
    );
    io.observe(el);
    resetObserver.observe(el);
    return () => {
      io.disconnect();
      resetObserver.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-motion={enhanced ? 'ready' : undefined}
      data-visible={visible ? 'true' : undefined}
      style={{ '--reveal-delay': `${delay}ms` }}
      onFocusCapture={event => {
        setVisible(true);
        onFocusCapture?.(event);
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
