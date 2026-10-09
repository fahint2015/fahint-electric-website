import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { studioRanges } from '../../data/studioCatalog.js';
import { StudioImage } from './StudioShared.jsx';
import Reveal from '../Reveal.jsx';

const locations = [
  {
    family: 'gfci',
    sku: 'GF15',
    label: 'GF15 GFCI Outlet',
    room: 'Kitchen protection',
    description: 'Self-test GFCI protection for the kitchen work surface.',
    x: '31%',
    y: '59%',
    side: 'right',
    pulse: '4.7s',
    delay: '-1.4s'
  },
  {
    family: 'usb-outlets',
    sku: 'FTR15C-3100',
    label: 'FTR15C-3100 USB Outlet',
    room: 'Bedside charging',
    description: 'Integrated USB-A and USB-C charging beside the bed or desk.',
    x: '38%',
    y: '34%',
    side: 'right',
    pulse: '5.9s',
    delay: '-3.2s'
  },
  {
    family: 'dimmers',
    sku: 'DM2010',
    label: 'DM2010 Digital Dimmer',
    room: 'Living room lighting',
    description: 'A digital slide dimmer for layered residential lighting.',
    x: '72%',
    y: '54%',
    side: 'left',
    pulse: '4.1s',
    delay: '-2.3s'
  },
  {
    family: 'lighting-switches',
    sku: 'DS15',
    label: 'DS15 Paddle Switch',
    room: 'Entry control',
    description: 'A single-pole paddle switch placed beside the entry door.',
    x: '86%',
    y: '56%',
    side: 'left',
    pulse: '6.3s',
    delay: '-4.7s'
  }
];

const mappedLocations = locations.map((location) => {
  const range = studioRanges.find((item) => item.slug === location.family);
  return { ...location, product: range.models.find((item) => item.sku === location.sku) };
});

export default function StudioApplicationMap() {
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
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      const focusedCard = document.activeElement?.closest('.studio-map-card');
      if (!focusedCard || focusedCard.hidden || !sectionRef.current?.contains(focusedCard)) setActiveSku(null);
    }, 160);
  };

  return <section
    ref={sectionRef}
    className="studio-application-map"
    aria-labelledby="studio-application-map-title"
    onMouseLeave={scheduleClose}
    onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) closeCard();
    }}
    onKeyDown={(event) => {
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
      <h2 id="studio-application-map-title">Power, room by room.</h2>
      <span>Explore where selected FAHINT devices belong in an everyday residential project.</span>
    </Reveal>

    <div className="studio-application-map__stage">
      <StudioImage
        className="studio-application-map__image"
        src="assets/images/editorial-home/fahint-residential-application-map-v1.webp"
        alt="Cutaway North American home showing a kitchen, bedroom, living area and entry"
        width={1664}
        height={936}
        responsive
      />
      <div className="studio-application-map__shade" aria-hidden="true" />
      <div className="studio-application-map__locations">
        {mappedLocations.map((location, index) => {
          const open = activeSku === location.product.sku;
          const cardId = `studio-application-card-${location.product.sku.toLowerCase()}`;
          return <div
            className={`studio-map-location studio-map-location--${index + 1}`}
            key={location.product.sku}
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
              onMouseEnter={() => openCard(location.product.sku)}
              onMouseLeave={scheduleClose}
              onFocus={() => openCard(location.product.sku)}
              onClick={() => openCard(location.product.sku)}
            >
              <span aria-hidden="true" />
            </button>
          </div>;
        })}
      </div>
    </div>

    {mappedLocations.map((location) => {
      const open = activeSku === location.product.sku;
      return <article
        className={`studio-map-card studio-map-card--${location.side}`}
        id={`studio-application-card-${location.product.sku.toLowerCase()}`}
        key={location.product.sku}
        hidden={!open}
        onMouseEnter={() => openCard(location.product.sku)}
        onMouseLeave={scheduleClose}
        onFocus={() => openCard(location.product.sku)}
        style={{ '--spot-x': location.x, '--spot-y': location.y }}
      >
        <div className="studio-map-card__image">
          <StudioImage src={location.product.assets.card} alt="" width={320} height={320} />
        </div>
        <div className="studio-map-card__copy">
          <span>{location.room}</span>
          <strong>{location.product.sku}</strong>
          <h3>{location.product.name}</h3>
          <p>{location.description}</p>
          <Link to={location.product.href} aria-label={`View ${location.label}`}>View product <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </article>;
    })}
  </section>;
}
