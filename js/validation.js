import {
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  PRICE_MAX,
  PRICE_MIN_BY_TYPE,
  ROOMS_TO_GUESTS,
} from './constants.js';

const form = document.querySelector('.ad-form');
const titleInput = /** @type {HTMLInputElement} */ (form.querySelector('#title'));
const typeSelect = /** @type {HTMLSelectElement} */ (form.querySelector('#type'));
const priceInput = /** @type {HTMLInputElement} */ (form.querySelector('#price'));
const timeIn = /** @type {HTMLSelectElement} */ (form.querySelector('#timein'));
const timeOut = /** @type {HTMLSelectElement} */ (form.querySelector('#timeout'));
const roomsSelect = /** @type {HTMLSelectElement} */ (form.querySelector('#room_number'));
const capacitySelect = /** @type {HTMLSelectElement} */ (form.querySelector('#capacity'));

let pristine = null;

function getMinPrice() {
  return PRICE_MIN_BY_TYPE[typeSelect.value] ?? 0;
}

function syncPriceAttributes() {
  const min = getMinPrice();
  priceInput.min = String(min);
  priceInput.placeholder = String(min);
  priceInput.max = String(PRICE_MAX);
}

function validateTitle(value) {
  return value.length >= TITLE_MIN_LENGTH && value.length <= TITLE_MAX_LENGTH;
}



function validatePrice(value) {
  const num = Number(value);
  const min = getMinPrice();
  return Number.isFinite(num) && num >= min && num <= PRICE_MAX;
}



function validateRoomsCapacity() {
  const allowed = ROOMS_TO_GUESTS[roomsSelect.value] || [];
  return allowed.includes(Number(capacitySelect.value));
}



function syncTime(src, dest) {
  return () => {
    dest.value = src.value;
  };
}

export function initValidation() {
  if (typeof Pristine === 'undefined') return null;
  pristine = new Pristine(form, {
    classTo: 'ad-form__element',
    errorTextParent: 'ad-form__element',
    errorTextClass: 'ad-form__element--error',
  });

  // Title
  pristine.addValidator(titleInput, validateTitle, 'Заголовок должен содержать от 30 до 100 символов');

  // Price
  syncPriceAttributes();
  pristine.addValidator(priceInput, validatePrice, 'Укажите подходящую цену для выбранного типа жилья');

  typeSelect.addEventListener('change', () => {
    syncPriceAttributes();
  });

  // Rooms/capacity
  pristine.addValidator(capacitySelect, validateRoomsCapacity, 'Количество комнат не соответствует количеству гостей');
  roomsSelect.addEventListener('change', () => {});
  capacitySelect.addEventListener('change', () => {});

  // Time sync
  timeIn.addEventListener('change', syncTime(timeIn, timeOut));
  timeOut.addEventListener('change', syncTime(timeOut, timeIn));

  // Начальные ошибки не показываем, валидация сработает при submit/change

  return pristine;
}

export function validateForm() {
  return pristine ? pristine.validate() : false;
}


