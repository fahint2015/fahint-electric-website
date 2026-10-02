import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { headEntries } from './metadata.js';

export function usePageMetadata(metadata) {
  const { pathname } = useLocation();
  const serialized = JSON.stringify(metadata);
  useEffect(() => {
    if (!serialized) return undefined;
    const entries = headEntries(JSON.parse(serialized), {
      path: pathname, siteUrl: import.meta.env.VITE_SITE_URL || '',
      publicUrl: new URL(import.meta.env.BASE_URL || '/', window.location.origin).href,
    });
    const restore = entries.map(entry => {
      const { tag, attributes = {}, text = '' } = entry;
      const key = tag === 'meta' ? (attributes.name ? 'name' : 'property') : tag === 'link' ? 'rel' : 'data-fahint-schema';
      const selector = tag === 'title' ? 'title' : `${tag}[${key}="${attributes[key]}"]`;
      let element = document.head.querySelector(selector);
      const original = element ? { attributes: [...element.attributes].map(attribute => [attribute.name, attribute.value]), text: element.textContent } : null;
      if (entry.remove) element?.remove();
      else {
        if (!element) { element = document.createElement(tag); document.head.append(element); }
        for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
        if (tag === 'title' || tag === 'script') element.textContent = text;
      }
      return () => {
        if (!original) element?.remove();
        else {
          for (const attribute of [...element.attributes]) element.removeAttribute(attribute.name);
          for (const [name, value] of original.attributes) element.setAttribute(name, value);
          element.textContent = original.text;
          if (!element.isConnected) document.head.append(element);
        }
      };
    });
    return () => restore.forEach(undo => undo());
  }, [serialized, pathname]);
}
