import {
  SLIDER_MIN,
  SLIDER_MAX,
  SLIDER_STEP,
  PRICE_MIN_BY_TYPE,
} from './constants.js';

// Инициализация noUiSlider для поля цены
export function initPriceSlider() {
  const form = document.querySelector('.ad-form');
  const priceInput = /** @type {HTMLInputElement} */ (form.querySelector('#price'));
  const typeSelect = /** @type {HTMLSelectElement} */ (form.querySelector('#type'));
  const slider = form.querySelector('.ad-form__slider');
  if (!priceInput || !typeSelect || !slider) return null;

  const getMinByType = () => PRICE_MIN_BY_TYPE[typeSelect.value] ?? SLIDER_MIN;

  // Создание слайдера
  noUiSlider.create(slider, {
    range: {
      min: SLIDER_MIN,
      max: SLIDER_MAX,
    },
    start: getMinByType(),
    step: SLIDER_STEP,
    connect: 'lower',
    format: {
      to: (v) => Math.round(v),
      from: (v) => Number(v),
    },
  });

  // Слайдер -> инпут
  slider.noUiSlider.on('update', (values) => {
    const value = String(values[0]);
    priceInput.value = value;
  });

  // Инпут -> слайдер
  priceInput.addEventListener('change', () => {
    const num = Number(priceInput.value);
    if (!Number.isFinite(num)) return;
    slider.noUiSlider.set(num);
  });

  // Обновление минимума при смене типа
  typeSelect.addEventListener('change', () => {
    const min = getMinByType();
    slider.noUiSlider.updateOptions({
      range: { min, max: SLIDER_MAX },
    });
    slider.noUiSlider.set(Math.max(min, Number(priceInput.value) || min));
  });

  return slider.noUiSlider;
}


