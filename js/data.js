/**
 * Нормализация структуры объявлений из API к удобному внутреннему формату
 * и простая валидация обязательных полей
 */

function normalizeAd(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const offer = raw.offer || {};
  const author = raw.author || {};
  const location = raw.location || {};

  const normalized = {
    id: raw.id ?? null,
    title: offer.title ?? '',
    address: offer.address ?? '',
    price: Number(offer.price ?? 0),
    type: offer.type ?? 'flat',
    rooms: Number(offer.rooms ?? 0),
    guests: Number(offer.guests ?? 0),
    checkin: offer.checkin ?? '',
    checkout: offer.checkout ?? '',
    features: Array.isArray(offer.features) ? offer.features.slice() : [],
    description: offer.description ?? '',
    photos: Array.isArray(offer.photos) ? offer.photos.slice() : [],
    avatar: author.avatar ?? '',
    lat: Number(location.lat ?? NaN),
    lng: Number(location.lng ?? NaN),
  };

  // Простая валидация координат
  if (Number.isNaN(normalized.lat) || Number.isNaN(normalized.lng)) {
    return null;
  }

  return normalized;
}

export function normalizeAds(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeAd).filter(Boolean);
}


