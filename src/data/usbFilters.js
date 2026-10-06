export const usbFilters = [
  { name: 'ports', label: 'USB ports', all: 'All port types', options: [
    ['dual-a', 'Dual USB-A'], ['a-c', 'USB-A + USB-C'], ['dual-c', 'Dual USB-C'], ['four-a', '4 × USB-A'],
  ] },
  { name: 'rating', label: 'Receptacle rating', all: 'All ratings', options: [
    ['15a', '15A'], ['20a', '20A'], ['usb-only', 'USB only'],
  ] },
  { name: 'charging', label: 'Charging output', all: 'All outputs', options: [
    ['5v-3.1', '5V · 3.1A'], ['5v-3.6', '5V · 3.6A'], ['5v-4.2', '5V · 4.2A'], ['5v-5', '5V · 5A'],
    ['pd-20w', 'PD 20W'], ['pd-36w', 'PD 36W'], ['pd-65w', 'PD 65W'],
  ] },
];

const portValues = {
  'Dual USB-A': 'dual-a', '2 × USB-A': 'dual-a', 'USB-A + USB-C': 'a-c',
  'Dual USB-C': 'dual-c', '2 × USB-C': 'dual-c', '4 × USB-A': 'four-a',
};

export function usbFilterValues(product) {
  const facts = new Map(product.specificationSummary);
  const rating = facts.get('Receptacle')?.match(/^(15|20)\s?A\b/)?.[1];
  const combined = facts.get('Combined USB output') || facts.get('Charging') || '';
  const current = combined.match(/\b(\d+(?:\.\d+)?)\s?A\b/)?.[1];
  const pd = product.group?.match(/^PD (20|36|65)W$/)?.[1];
  return {
    ports: portValues[facts.get('Interfaces')] || '',
    rating: rating ? `${rating}a` : facts.has('Input') && !facts.has('Receptacle') ? 'usb-only' : '',
    charging: pd ? `pd-${pd}w` : current && /\b5\s?V\b/.test(combined) ? `5v-${Number(current)}` : '',
  };
}

export function filterUsbProducts(products, selected = {}) {
  return products.filter(product => {
    const values = usbFilterValues(product);
    return usbFilters.every(({ name }) => !selected[name] || selected[name] === values[name]);
  });
}
