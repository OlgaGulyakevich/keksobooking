import { getAds } from './api.js';
import { normalizeAds } from './data.js';
import { initMap, onMainPinMove, formatCoords, renderPins } from './map.js';
import { createAdPopup } from './popup.js';
import { qs } from './util.js';
import { initForm } from './form.js';
import { initPriceSlider } from './slider.js';
import { getFilters, filterAds, onFiltersChange, rankAds } from './filter.js';
import { showErrorMessage } from './util.js';

const form = document.querySelector('.ad-form');
const formElements = form.querySelectorAll('fieldset, select, input, textarea, button');
const filtersForm = document.querySelector('.map__filters');
const addressInput = /** @type {HTMLInputElement} */ (qs('#address'));

function setAdFormDisabled(disabled) {
  form.classList.toggle('ad-form--disabled', disabled);
  formElements.forEach((el) => { el.disabled = disabled; });
  const slider = document.querySelector('.ad-form__slider');
  if (slider && slider.noUiSlider) {
    const base = slider.querySelector('.noUi-base');
    if (base) base.style.pointerEvents = disabled ? 'none' : '';
  }
}

function setFiltersDisabled(disabled) {
  filtersForm.classList.toggle('map__filters--disabled', disabled);
  Array.from(filtersForm.elements).forEach((el) => { el.disabled = disabled; });
}

function updateAddressField(coords) {
  addressInput.value = formatCoords(coords);
}

let cachedAds = [];

async function bootstrap() {
  // Старт: обе формы неактивны
  setAdFormDisabled(true);
  setFiltersDisabled(true);

  initMap(() => {
    // После инициализации карты активируем только форму объявления
    setAdFormDisabled(false);
  });

  initForm();
  initPriceSlider();

  onMainPinMove(updateAddressField);

  try {
    const raw = await getAds();
    cachedAds = normalizeAds(raw);
    renderPins(cachedAds, createAdPopup);
    // Данные загружены — делаем фильтры доступными
    setFiltersDisabled(false);
    onFiltersChange(() => {
      const current = getFilters();
      const filtered = filterAds(cachedAds, current);
      const ranked = rankAds(filtered, current);
      renderPins(ranked, createAdPopup);
    });
  } catch (e) {
    showErrorMessage('Не удалось загрузить данные объявлений. Попробуйте позже');
    // В случае ошибки фильтры остаются отключёнными
  }
}

bootstrap();




