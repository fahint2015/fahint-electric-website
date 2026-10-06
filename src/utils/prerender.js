export const normalizePathname = path => path.replace(/\/+$/, '') || '/';

export function canHydratePage(root, location) {
  // Query state and fallback URLs may differ from the generated page's default state.
  return root.hasChildNodes() && !location.search && typeof root.dataset.prerenderPath === 'string'
    && normalizePathname(root.dataset.prerenderPath) === normalizePathname(location.pathname);
}
