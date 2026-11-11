import { forwardRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default forwardRef(function CatalogFilterPanel({ children }, ref) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia?.('(max-width: 920px)');
    if (!media) return undefined;
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  if (!mobile) return <aside ref={ref} className="catalog-filter-sidebar">{children}</aside>;
  const close = event => event.currentTarget.closest('dialog').close();
  return <dialog ref={ref} className="catalog-filter-dialog" aria-labelledby="catalog-filter-title"
    onClick={event => { if (event.target.closest('a[href]')) event.currentTarget.close(); }}>
    <header>
      <h2 id="catalog-filter-title">Filter models</h2>
      <button type="button" onClick={close} aria-label="Close filters" autoFocus><X size={22} aria-hidden="true" /></button>
    </header>
    {children}
    <footer><button type="button" className="usb-comparison__open" onClick={close}>View models</button></footer>
  </dialog>;
});
