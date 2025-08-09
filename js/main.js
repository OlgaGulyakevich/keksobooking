import { getAds } from './api.js';
import { normalizeAds } from './data.js';
import { initMap, onMainPinMove, formatCoords, renderPins } from './map.js';
import { createAdPopup } from './popup.js';
import { qs } from './util.js';

const form = document.querySelector('.ad-form');
const formElements = form.querySelectorAll('fieldset, select, input, textarea, button');
const filtersForm = document.querySelector('.map__filters');
const addressInput = /** @type {HTMLInputElement} */ (qs('#address'));

function setFormDisabled(disabled) {
  form.classList.toggle('ad-form--disabled', disabled);
  filtersForm.classList.toggle('map__filters--disabled', disabled);
  [...formElements, ...filtersForm.elements].forEach((el) => {
    el.disabled = disabled;
  });
}

function updateAddressField(coords) {
  addressInput.value = formatCoords(coords);
}

async function bootstrap() {
  // Старт: форма неактивна
  setFormDisabled(true);

  // Инициализация карты, затем включаем формы
  initMap(() => {
    setFormDisabled(false);
  });

  onMainPinMove(updateAddressField);

  try {
    const raw = await getAds();
    const ads = normalizeAds(raw);
    renderPins(ads, createAdPopup);
  } catch (e) {
    // Ошибки загрузки данных не блокируют карту и форму
    // Можно добавить показ баннера/уведомления
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

bootstrap();




