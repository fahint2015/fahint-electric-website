import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import Header from './Header.jsx';

function renderHeader(path = '/') {
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Header />
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('uses the official archived Fahint logo without the synthetic mark', () => {
    renderHeader();

    const logo = screen.getByRole('img', { name: 'Fahint' });
    expect(logo).toHaveAttribute('src', 'assets/images/brand/fahint-logo-navy.png');
    expect(document.querySelector('.logo__mark')).not.toBeInTheDocument();
    expect(document.querySelector('.logo__text')).not.toBeInTheDocument();
  });

  it('keeps the existing navigation and inquiry action', () => {
    renderHeader();

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Send Inquiry/i })).toHaveAttribute('href', '/#studio-inquiry');
  });

  it('uses a transparent overlay at the top of the homepage and glass after scrolling', () => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    const { container } = renderHeader('/');
    const header = container.querySelector('.header');
    expect(header).toHaveClass('header--home', 'header--transparent');
    expect(header).not.toHaveClass('header--solid');

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 80 });
    fireEvent.scroll(window);
    expect(header).toHaveClass('header--home', 'header--solid');
    expect(header).not.toHaveClass('header--transparent');

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  });

  it('keeps inner-page navigation solid and outside the homepage overlay treatment', () => {
    const { container } = renderHeader('/products');
    const header = container.querySelector('.header');
    expect(header).toHaveClass('header--solid');
    expect(header).not.toHaveClass('header--home');
  });

  it('restores the transparent homepage header after closing its readable mobile menu', () => {
    const { container } = renderHeader('/');
    const header = container.querySelector('.header');
    const toggle = screen.getByRole('button', { name: 'Toggle menu' });
    expect(header).toHaveClass('header--transparent');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(header).toHaveClass('header--solid');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(header).toHaveClass('header--transparent');
  });

  it('keeps Home navigation within the independent homepage preview', () => {
    renderHeader('/home-next');

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/home-next');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Fahint Electric' })).toHaveAttribute('href', '/home-next');
  });

  it('lets keyboard users skip the repeated navigation', () => {
    renderHeader();

    expect(screen.getByRole('link', { name: 'Skip to main content' }))
      .toHaveAttribute('href', '/#main-content');
  });

  it('uses a full-width sticky glass surface instead of a floating rounded card', () => {
    const styles = readFileSync('src/styles.css', 'utf8');

    expect(styles).toMatch(
      /\.header\s*\{[\s\S]*?position:\s*sticky;[\s\S]*?top:\s*0;[\s\S]*?backdrop-filter:\s*blur\(20px\)\s+saturate\(145%\)/
    );
    expect(styles).toMatch(
      /\.header__inner\s*\{[\s\S]*?width:\s*min\(calc\(100%\s*-\s*48px\),\s*1480px\);[\s\S]*?border:\s*0;[\s\S]*?border-radius:\s*0;[\s\S]*?background:\s*transparent/
    );
    expect(styles).not.toMatch(/\.header\s*\{[^}]*inset:\s*16px\s+0\s+auto\s+0/);
  });

  it('defines transparent and scrolled glass states specifically for the homepage', () => {
    const styles = readFileSync('src/styles.css', 'utf8');
    expect(styles).toMatch(/\.header--home\s*\{[^}]*position:\s*fixed/);
    expect(styles).toMatch(
      /\.header--home\.header--transparent\s*\{[^}]*background:\s*transparent[^}]*backdrop-filter:\s*none/
    );
    expect(styles).toMatch(
      /\.header--home\.header--solid\s*\{[^}]*background:\s*rgba\(247,\s*250,\s*252,\s*\.82\)[^}]*backdrop-filter:\s*blur\(22px\)\s+saturate\(160%\)/
    );
  });

  it('uses the same full-width glass structure on phones', () => {
    const styles = readFileSync('src/styles.css', 'utf8');
    const mobile = styles.slice(styles.indexOf('@media (max-width: 900px)'));

    expect(mobile).toMatch(/:root\s*\{[^}]*--header-h:\s*64px/);
    expect(mobile).toMatch(/\.header__inner\s*\{[^}]*width:\s*min\(100%\s*-\s*28px,\s*1480px\)/);
    expect(mobile).toMatch(
      /\.mobile-menu\s*\{[^}]*background:\s*rgba\(247,\s*250,\s*252,\s*\.96\)[^}]*backdrop-filter:\s*blur\(20px\)/
    );
  });

  it('uses explicit compact desktop gaps instead of auto-pushing the menu', () => {
    const styles = readFileSync('src/styles.css', 'utf8');

    expect(styles).toMatch(
      /\.header__inner\s*\{[\s\S]*?grid-template-columns:\s*200px\s+max-content\s+190px;[\s\S]*?column-gap:\s*48px/
    );
    expect(styles).not.toMatch(/\.nav\s*\{[^}]*margin-left:\s*auto/);
    expect(styles).toMatch(/\.logo__image\s*\{[\s\S]*?width:\s*170px/);
  });

  it('preserves grid centering for both mobile navigation icons in the shared stylesheet', () => {
    const base = readFileSync('src/styles.css', 'utf8');
    const shared = readFileSync('src/styles/site-system.css', 'utf8');
    const mobile = shared.slice(shared.indexOf('@media (max-width: 960px)'));

    expect(base).toMatch(/\.burger\s*\{[^}]*place-items:\s*center/);
    expect(mobile).toMatch(/\.header\s+\.burger\s*\{[^}]*display:\s*grid/);
  });

  it('keeps an expanded mobile product menu scrollable inside the viewport', () => {
    const styles = readFileSync('src/styles.css', 'utf8');

    expect(styles).toMatch(
      /@media\s*\(max-width:\s*900px\)[\s\S]*?\.mobile-menu\s*\{[^}]*max-height:\s*calc\(100dvh\s*-\s*var\(--header-h\)\);[^}]*overflow-y:\s*auto/
    );
  });

  it('does not reserve a second header height in page-leading padding', () => {
    const shared = readFileSync('src/styles.css', 'utf8');
    const product = readFileSync('src/styles/product-experience.css', 'utf8');

    expect(shared).not.toMatch(/padding(?:-top)?:[^;\n]*var\(--header-h\)/);
    expect(product).not.toMatch(/padding(?:-top)?:[^;\n]*var\(--header-h\)/);
  });

  it('does not animate unrelated properties', () => {
    const styles = readFileSync('src/styles.css', 'utf8');

    expect(styles).not.toMatch(/transition:\s*all\b/);
  });

  it('animates the navigation marker without changing layout width', () => {
    const styles = readFileSync('src/styles.css', 'utf8');
    expect(styles).toMatch(/\.nav a::after\s*\{[^}]*width:\s*100%[^}]*transform:\s*scaleX\(0\)[^}]*transition:\s*transform/);
    expect(styles).not.toMatch(/\.nav a::after\s*\{[^}]*transition:\s*width/);
    expect(styles).toMatch(/\.nav a\.is-active::after\s*\{[^}]*transform:\s*scaleX\(1\)/);
  });
});
