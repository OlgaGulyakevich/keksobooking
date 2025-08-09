import { TEMPLATE_ID_CARD } from './constants.js';

const TYPE_TO_RU = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

function setTextOrHide(element, value) {
  if (!element) return;
  if (value == null || value === '') {
    element.classList.add('visually-hidden');
    return;
  }
  element.textContent = String(value);
}

function buildCapacity(rooms, guests) {
  if (!rooms || rooms < 0 || !Number.isFinite(rooms)) return '';
  if (!Number.isFinite(guests) || guests < 0) return '';
  const roomsLabel = rooms === 1 ? 'комната' : rooms >= 2 && rooms <= 4 ? 'комнаты' : 'комнат';
  const guestsLabel = guests === 1 ? 'гостя' : 'гостей';
  return `${rooms} ${roomsLabel} для ${guests} ${guestsLabel}`;
}

function buildTime(checkin, checkout) {
  const hasIn = Boolean(checkin);
  const hasOut = Boolean(checkout);
  if (!hasIn && !hasOut) return '';
  if (hasIn && hasOut) return `Заезд после ${checkin}, выезд до ${checkout}`;
  if (hasIn) return `Заезд после ${checkin}`;
  return `Выезд до ${checkout}`;
}

function fillFeatures(listElement, features) {
  if (!listElement) return;
  if (!Array.isArray(features) || features.length === 0) {
    listElement.classList.add('visually-hidden');
    return;
  }
  listElement.innerHTML = '';
  features.forEach((f) => {
    const li = document.createElement('li');
    li.className = `popup__feature popup__feature--${f}`;
    listElement.appendChild(li);
  });
}

function fillPhotos(container, photos) {
  if (!container) return;
  if (!Array.isArray(photos) || photos.length === 0) {
    container.classList.add('visually-hidden');
    return;
  }
  container.innerHTML = '';
  photos.forEach((src) => {
    const img = document.createElement('img');
    img.className = 'popup__photo';
    img.src = src;
    img.width = 45;
    img.height = 40;
    img.alt = 'Фотография жилья';
    container.appendChild(img);
  });
}

export function createAdPopup(ad) {
  const template = document.querySelector(`#${TEMPLATE_ID_CARD}`);
  const content = template?.content?.firstElementChild?.cloneNode(true);
  if (!content) return document.createElement('div');

  const avatarEl = content.querySelector('.popup__avatar');
  const titleEl = content.querySelector('.popup__title');
  const addressEl = content.querySelector('.popup__text--address');
  const priceEl = content.querySelector('.popup__text--price');
  const typeEl = content.querySelector('.popup__type');
  const capacityEl = content.querySelector('.popup__text--capacity');
  const timeEl = content.querySelector('.popup__text--time');
  const featuresEl = content.querySelector('.popup__features');
  const descriptionEl = content.querySelector('.popup__description');
  const photosEl = content.querySelector('.popup__photos');

  // Аватар
  if (ad.avatar) {
    avatarEl.src = ad.avatar;
  } else if (avatarEl) {
    avatarEl.classList.add('visually-hidden');
  }

  setTextOrHide(titleEl, ad.title);
  setTextOrHide(addressEl, ad.address);

  if (priceEl) {
    if (Number.isFinite(ad.price) && ad.price > 0) {
      priceEl.innerHTML = `${ad.price} <span>₽/ночь</span>`;
    } else {
      priceEl.classList.add('visually-hidden');
    }
  }

  setTextOrHide(typeEl, TYPE_TO_RU[ad.type] || ad.type || '');
  setTextOrHide(capacityEl, buildCapacity(ad.rooms, ad.guests));
  setTextOrHide(timeEl, buildTime(ad.checkin, ad.checkout));
  setTextOrHide(descriptionEl, ad.description);

  fillFeatures(featuresEl, ad.features);
  fillPhotos(photosEl, ad.photos);

  return content;
}


