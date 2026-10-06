import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { canHydratePage } from './utils/prerender.js';
import './styles.css';
import './styles/product-experience.css';
import './styles/catalog.css';
import './styles/brand-catalog.css';
import './styles/homepage.css';
import './styles/site-system.css';

const root = document.getElementById('root');
const app = <BrowserRouter
  basename={import.meta.env.BASE_URL.replace(/\/$/, '')}
  future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
><App /></BrowserRouter>;

if (canHydratePage(root, window.location)) hydrateRoot(root, app);
else createRoot(root).render(app);
