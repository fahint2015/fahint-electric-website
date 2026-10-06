import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { normalizePathname } from './utils/prerender.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FloatingRail from './components/FloatingRail.jsx';
import RouteFocusManager from './components/RouteFocusManager.jsx';
import NotFound from './pages/NotFound.jsx';

const Blog = lazy(() => import('./pages/Blog.jsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'));
const Capabilities = lazy(() => import('./pages/Capabilities.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const LineDetail = lazy(() => import('./pages/LineDetail.jsx'));
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'));
const ProductsOverview = import.meta.env.DEV ? lazy(() => import('./pages/ProductsOverview.jsx')) : null;
const GfciSeries = lazy(() => import('./pages/GfciSeries.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Resources = lazy(() => import('./pages/Resources.jsx'));
const HomeNext = import.meta.env.DEV ? lazy(() => import('./pages/HomeNext.jsx')) : null;
const HomeLegacy = import.meta.env.DEV ? lazy(() => import('./pages/Home.jsx')) : null;
const HomeStudio = lazy(() => import('./pages/HomeStudio.jsx'));
const ProductsStudio = lazy(() => import('./pages/ProductsStudio.jsx'));

export default function App() {
  const location = useLocation();
  return <>
    <Header />
    <main id="main-content" tabIndex={-1}>
      <Suspense fallback={<div className="catalog-loading" role="status">Loading page…</div>}>
        <RouteFocusManager />
        <Routes location={{ ...location, pathname: normalizePathname(location.pathname) }}>
          <Route path="/" element={<HomeStudio />} />
          {import.meta.env.DEV && <Route path="/home-next" element={<HomeNext />} />}
          {import.meta.env.DEV && <Route path="/home-legacy" element={<HomeLegacy />} />}
          {import.meta.env.DEV && <Route path="/products-legacy" element={<ProductsOverview />} />}
          <Route path="/home-studio" element={<HomeStudio />} />
          <Route path="/products-studio" element={<ProductsStudio />} />
          <Route path="/products" element={<ProductsStudio />} />
          <Route path="/products/gfci" element={<GfciSeries />} />
          <Route path="/products/gfci/:sku" element={<ProductDetail />} />
          <Route path="/products/:line" element={<LineDetail />} />
          <Route path="/products/:line/:sku" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/capabilities" element={<Capabilities />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
    <Footer />
    <FloatingRail />
  </>;
}
