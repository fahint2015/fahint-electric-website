import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, matchPath } from 'react-router-dom';
import { normalizePathname } from './utils/prerender.js';
import FloatingRail from './components/FloatingRail.jsx';
import RouteFocusManager from './components/RouteFocusManager.jsx';
import NotFound from './pages/NotFound.jsx';
import BrandHeader from './components/BrandHeader.jsx';
import BrandFooter from './components/BrandFooter.jsx';

const Header = lazy(() => import('./components/Header.jsx'));
const Footer = lazy(() => import('./components/Footer.jsx'));
const HomeBrand = lazy(() => import('./pages/HomeBrand.jsx'));
const Applications = lazy(() => import('./pages/Applications.jsx'));
const ApplicationDetail = lazy(() => import('./pages/ApplicationDetail.jsx'));
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
  const legacy = ['/home-studio', '/home-previous', '/home-next', '/home-legacy', '/products-legacy'].includes(normalizePathname(location.pathname));
  return <div className={legacy ? 'legacy-site' : 'brand-site'}>
    {legacy ? <Suspense fallback={null}><Header /></Suspense> : <BrandHeader />}
    <main id="main-content" tabIndex={-1}>
      <Suspense fallback={<div className="catalog-loading" role="status">Loading page…</div>}>
        <RouteFocusManager />
        <Routes location={{ ...location, pathname: normalizePathname(location.pathname) }}>
          <Route path="/" element={<HomeBrand />} />
          {import.meta.env.DEV && <Route path="/home-previous" element={<HomeStudio />} />}
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/residential" element={<ApplicationDetail key="residential" application="residential" />} />
          <Route path="/applications/workplace" element={<ApplicationDetail key="workplace" application="workplace" />} />
          <Route path="/applications/hospitality" element={<ApplicationDetail key="hospitality" application="hospitality" />} />
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
    {legacy ? <Suspense fallback={null}><Footer /></Suspense> : <BrandFooter />}
    {/* Product pages supply their resolved model without loading the catalogue on other pages. */}
    {!matchPath('/products/:line/:sku', normalizePathname(location.pathname)) && <FloatingRail />}
  </div>;
}
