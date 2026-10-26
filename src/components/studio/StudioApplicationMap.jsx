import { useEffect, useRef, useState } from 'react';
import { Link } from '../SiteLink.jsx';
import { ArrowUpRight } from 'lucide-react';
import { StudioImage } from './StudioShared.jsx';
import Reveal from '../Reveal.jsx';
import '../../styles/studio.css';

// Keep the four presentation cards independent of the complete product catalog.
// StudioPages.test.jsx checks their titles, images and links against model records.
const locations = [
  {
    sku: 'GF15',
    name: '15A Self-Test GFCI Receptacle',
    href: '/products/gfci/gf15',
    image: 'assets/images/products/gf15-plate.webp',
    label: 'GF15 GFCI Outlet',
    room: 'Kitchen protection',
    description: 'Self-test GFCI protection for the kitchen work surface.',
    // Coordinates are relative to the complete 1664 × 936 photograph.
    // Backsplash above the counter, to the left of the sink.
    x: '26.3%',
    y: '61.2%',
    side: 'right',
    pulse: '4.7s',
    delay: '-1.4s'
  },
  {
    sku: 'FTR15C-3100',
    name: '15A USB-A + USB-C Outlet · 3.1A',
    href: '/products/usb-outlets/ftr15c-3100',
    image: 'assets/images/catalog/models/76ec84b1975cf9a7.webp',
    label: 'FTR15C-3100 USB Outlet',
    room: 'Bedside charging',
    description: 'Integrated USB-A and USB-C charging beside the bed or desk.',
    // Wall beside the right bedside table, clear of the bed and lamp.
    x: '49.7%',
    y: '37.4%',
    side: 'right',
    pulse: '5.9s',
    delay: '-3.2s'
  },
  {
    sku: 'DM2010',
    name: 'Digital Slide Dimmer',
    href: '/products/dimmers/dm2010',
    image: 'assets/images/catalog/models/4216815caa30cd41.webp',
    label: 'DM2010 Digital Dimmer',
    room: 'Living room lighting',
    description: 'A digital slide dimmer for layered residential lighting.',
    // Living-room wall beside the fireplace, away from the pendant light.
    x: '74%',
    y: '59.4%',
    side: 'left',
    pulse: '4.1s',
    delay: '-2.3s'
  },
  {
    sku: 'DS15',
    name: '15A Single-Pole Paddle Switch',
    href: '/products/lighting-switches/ds15',
    image: 'assets/images/catalog/models/50e6f2d3f5cf9b64.webp',
    label: 'DS15 Paddle Switch',
    room: 'Entry control',
    description: 'A single-pole paddle switch placed beside the entry door.',
    // Wall to the right of the entry door, rather than the door leaf.
    x: '89.7%',
    y: '58.7%',
    side: 'left',
    pulse: '6.3s',
    delay: '-4.7s'
  }
];

export default function StudioApplicationMap({ imageSrc = 'assets/images/editorial-home/fahint-residential-application-map-v1.webp' }) {
  const [activeSku, setActiveSku] = useState(null);
  const sectionRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openCard = (sku) => {
    clearTimeout(closeTimer.current);
    setActiveSku(sku);
  };
  const closeCard = () => {
    clearTimeout(closeTimer.current);
    setActiveSku(null);
  };
  // Match the navigation menu's short grace period for crossing into the card.
  const scheduleClose = () => {
    // Touch taps can emit mouse-leave events; keep their card open for the next tap.
    if (window.matchMedia?.('(hover: none)').matches) return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      const focusedCard = document.activeElement?.closest('.studio-map-card');
      if (!focusedCard || focusedCard.hidden || !sectionRef.current?.contains(focusedCard)) setActiveSku(null);
    }, 160);
  };

  return <section
    ref={sectionRef}
    id="room-by-room"
    className="studio-application-map"
    aria-labelledby="studio-application-map-title"
    onMouseLeave={scheduleClose}
    onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) closeCard();
    }}
    onKeyDown={(event) => {
      if (event.key === 'Tab' && activeSku) {
        const hotspot = event.currentTarget.querySelector('.studio-map-hotspot[aria-expanded=true]');
        const card = document.getElementById(hotspot?.getAttribute('aria-controls'));
        // Keep each product link directly after its hotspot in keyboard order.
        const target = event.target === hotspot && !event.shiftKey
          ? card?.querySelector('a')
          : event.target.closest('.studio-map-card')
            ? event.shiftKey ? hotspot : hotspot?.parentElement.nextElementSibling?.querySelector('button')
            : null;
        if (target) {
          event.preventDefault();
          target.focus();
        }
        return;
      }
      if (event.key !== 'Escape' || !activeSku) return;
      event.stopPropagation();
      if (event.target.closest('.studio-map-card')) {
        event.currentTarget.querySelector('.studio-map-hotspot[aria-expanded=true]')?.focus();
      }
      closeCard();
    }}
  >
    <Reveal as="header" className="studio-application-map__intro">
      <p>MADE FOR REAL SPACES</p>
      <h2 id="studio-application-map-title">Power, room <br />by room.</h2>
      <span>Explore where selected FAHINT devices belong in an everyday residential project.</span>
    </Reveal>

    <div className="studio-application-map__stage">
      <StudioImage
        className="studio-application-map__image"
        src={imageSrc}
        alt="Cutaway North American home showing a kitchen, bedroom, living area and entry"
        width={1664}
        height={936}
        responsive
      />
      <div className="studio-application-map__shade" aria-hidden="true" />
      <div className="studio-application-map__locations">
        {locations.map((location, index) => {
          const open = activeSku === location.sku;
          const cardId = `studio-application-card-${location.sku.toLowerCase()}`;
          return <div
            className={`studio-map-location studio-map-location--${index + 1}`}
            key={location.sku}
            style={{
              '--spot-x': location.x,
              '--spot-y': location.y,
              '--pulse-duration': location.pulse,
              '--pulse-delay': location.delay
            }}
          >
            <button
              type="button"
              className="studio-map-hotspot"
              aria-label={`Show ${location.label}`}
              aria-expanded={open}
              aria-controls={cardId}
              onMouseEnter={() => openCard(location.sku)}
              onMouseLeave={scheduleClose}
              onFocus={() => openCard(location.sku)}
              onClick={() => openCard(location.sku)}
            >
              <span aria-hidden="true" />
            </button>
          </div>;
        })}
      </div>
    </div>

    {locations.map((location) => {
      const open = activeSku === location.sku;
      return <article
        className={`studio-map-card studio-map-card--${location.side}`}
        id={`studio-application-card-${location.sku.toLowerCase()}`}
        key={location.sku}
        hidden={!open}
        onMouseEnter={() => openCard(location.sku)}
        onMouseLeave={scheduleClose}
        onFocus={() => openCard(location.sku)}
        style={{ '--spot-x': location.x, '--spot-y': location.y }}
      >
        <div className="studio-map-card__image">
          <StudioImage src={location.image} alt="" width={320} height={320} />
        </div>
        <div className="studio-map-card__copy">
          <span>{location.room}</span>
          <strong>{location.sku}</strong>
          <h3>{location.name}</h3>
          <p>{location.description}</p>
          <Link to={location.href} aria-label={`View ${location.label}`}>View product <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </article>;
    })}
  </section>;
}
