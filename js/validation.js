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

function getTitleError() {
  const len = titleInput.value.length;
  if (len < TITLE_MIN_LENGTH) {
    return `Ещё ${TITLE_MIN_LENGTH - len} сим.`;
  }
  if (len > TITLE_MAX_LENGTH) {
    return `Лишних ${len - TITLE_MAX_LENGTH} сим.`;
  }
  return '';
}

function validatePrice(value) {
  const num = Number(value);
  const min = getMinPrice();
  return Number.isFinite(num) && num >= min && num <= PRICE_MAX;
}

function getPriceError() {
  const min = getMinPrice();
  return `Минимум для типа — ${min}, максимум — ${PRICE_MAX}`;
}

function validateRoomsCapacity() {
  const allowed = ROOMS_TO_GUESTS[roomsSelect.value] || [];
  return allowed.includes(Number(capacitySelect.value));
}

function getRoomsCapacityError() {
  const allowed = ROOMS_TO_GUESTS[roomsSelect.value] || [];
  if (allowed.length === 0) return 'Недопустимое сочетание';
  const readable = allowed
    .map((g) => (g === 0 ? 'не для гостей' : `${g}`))
    .join(', ');
  return `Доступно: ${readable}`;
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
    errorTextClass: 'ad-form__error',
  });

  // Title
  pristine.addValidator(titleInput, validateTitle, getTitleError);

  // Price
  syncPriceAttributes();
  pristine.addValidator(priceInput, validatePrice, getPriceError);

  typeSelect.addEventListener('change', () => {
    syncPriceAttributes();
    pristine.validate(priceInput);
  });

  // Rooms/capacity
  pristine.addValidator(capacitySelect, validateRoomsCapacity, getRoomsCapacityError);
  roomsSelect.addEventListener('change', () => pristine.validate(capacitySelect));
  capacitySelect.addEventListener('change', () => pristine.validate(capacitySelect));

  // Time sync
  timeIn.addEventListener('change', syncTime(timeIn, timeOut));
  timeOut.addEventListener('change', syncTime(timeOut, timeIn));

  // Проверка начальной валидности для несовместимых комнат/гостей
  pristine.validate(capacitySelect);
  pristine.validate(titleInput);
  pristine.validate(priceInput);

  return pristine;
}

export function validateForm() {
  return pristine ? pristine.validate() : false;
}


