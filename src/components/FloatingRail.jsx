import { useEffect, useState } from 'react';
import { Mail, ArrowUp } from 'lucide-react';
import { company } from '../data/company.js';
import { publicAsset } from '../utils/publicAsset.js';

// Keep the destinations available without JavaScript or opening a contact form.
export default function FloatingRail({ product }) {
  const [show, setShow] = useState(false);
  const message = product
    ? `Hi FAHINT, I'm interested in ${product.sku} (${product.name}). Could you share pricing and availability?`
    : '';
  const whatsappHref = `https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  const emailHref = `mailto:${company.email}${message ? `?subject=${encodeURIComponent(`Inquiry about ${product.sku}`)}&body=${encodeURIComponent(message)}` : ''}`;

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="rail" aria-label="Quick contact">
      <a
        className="rail__item rail__item--wa"
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp ${company.phone}`}
      >
        <span className="rail__panel">
          <strong>WhatsApp</strong>
          <span>{company.phone}</span>
        </span>
        <span className="rail__icon">
          <img className="rail__whatsapp-mark" src={publicAsset('assets/icons/social/whatsapp.svg')} width="26" height="26" alt="" aria-hidden="true" />
        </span>
      </a>

      <a className="rail__item rail__item--email" href={emailHref} aria-label={`Email ${company.email}`}>
        <span className="rail__panel">
          <strong>Email</strong>
          <span>{company.email}</span>
        </span>
        <span className="rail__icon">
          <Mail size={24} strokeWidth={1.8} aria-hidden="true" />
        </span>
      </a>

      {show && (
        <button
          type="button"
          className="rail__item rail__item--top"
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
          aria-label="Back to top"
        >
          <span className="rail__panel">
            <strong>Back to top</strong>
          </span>
          <span className="rail__icon">
            <ArrowUp size={20} aria-hidden="true" />
          </span>
        </button>
      )}
    </nav>
  );
}
