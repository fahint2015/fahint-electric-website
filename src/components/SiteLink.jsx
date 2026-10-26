import { forwardRef } from 'react';
import { Link as RouterLink, useMatch, useResolvedPath } from 'react-router-dom';
import { pageHref } from '../utils/pageHref.js';

function usePageTarget(to, relative) {
  const resolved = useResolvedPath(to, { relative });
  if (typeof to === 'string' && /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(to)) return to;
  return { ...resolved, pathname: pageHref(resolved.pathname) };
}

export const Link = forwardRef(function Link({ to, relative, ...props }, ref) {
  const target = usePageTarget(to, relative);
  return <RouterLink {...props} to={target} ref={ref} />;
});

export const NavLink = forwardRef(function NavLink({ to, relative, end = false, caseSensitive = false, className, style, children, 'aria-current': ariaCurrent = 'page', ...props }, ref) {
  const target = usePageTarget(to, relative);
  // This site uses a declarative router. Match both forms of legacy page URLs,
  // while always emitting the canonical href for navigation and crawlers.
  const path = typeof target === 'string' ? target : target.pathname;
  const match = useMatch({ path, caseSensitive, end: end || path === '/' });
  const state = { isActive: Boolean(match), isPending: false, isTransitioning: false };
  return <RouterLink {...props} to={target} ref={ref}
    aria-current={state.isActive ? ariaCurrent : undefined}
    className={typeof className === 'function' ? className(state) : [className, state.isActive && 'active'].filter(Boolean).join(' ')}
    style={typeof style === 'function' ? style(state) : style}>
    {typeof children === 'function' ? children(state) : children}
  </RouterLink>;
});
