import { DEBOUNCE_DELAY_MS } from './constants.js';
import { debounce } from './util.js';

const filtersForm = document.querySelector('.map__filters');

function getSelectedFeatures() {
  return Array.from(filtersForm.querySelectorAll('input[name="features"]:checked')).map((el) => el.value);
}

export function getFilters() {
  return {
    type: filtersForm.querySelector('#housing-type').value,
    price: filtersForm.querySelector('#housing-price').value,
    rooms: filtersForm.querySelector('#housing-rooms').value,
    guests: filtersForm.querySelector('#housing-guests').value,
    features: getSelectedFeatures(),
  };
}

function priceToBand(price) {
  if (!Number.isFinite(price)) return 'any';
  if (price < 10000) return 'low';
  if (price > 50000) return 'high';
  return 'middle';
}

export function filterAds(ads, filters) {
  return ads.filter((ad) => {
    if (filters.type !== 'any' && ad.type !== filters.type) return false;
    if (filters.rooms !== 'any' && Number(filters.rooms) !== ad.rooms) return false;
    if (filters.guests !== 'any' && Number(filters.guests) !== ad.guests) return false;
    if (filters.price !== 'any' && priceToBand(ad.price) !== filters.price) return false;
    if (filters.features.length > 0) {
      const hasAll = filters.features.every((f) => ad.features?.includes(f));
      if (!hasAll) return false;
    }
    return true;
  });
}

export function onFiltersChange(callback) {
  const handler = debounce(callback, DEBOUNCE_DELAY_MS);
  filtersForm.addEventListener('change', handler);
  return () => filtersForm.removeEventListener('change', handler);
}


