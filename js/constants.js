/**
 * Базовые константы проекта Keksobooking
 */

// Форматирование чисел
export const DEFAULT_DECIMAL_PRECISION = 5;

// Карта (Токио)
export const MAP_CENTER = { lat: 35.6895, lng: 139.6917 };
export const MAP_DEFAULT_ZOOM = 13; // Увеличиваем масштаб для лучшего обзора
export const MAX_VISIBLE_PINS = 10;

// Ограничения значений полей
export const TITLE_MIN_LENGTH = 30;
export const TITLE_MAX_LENGTH = 100;
export const PRICE_MAX = 100000;

// Минимальная цена по типу жилья
export const PRICE_MIN_BY_TYPE = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
};

// Соответствие количества комнат — количеству гостей
export const ROOMS_TO_GUESTS = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0],
};

// Слайдер цены
export const SLIDER_MIN = 0;
export const SLIDER_MAX = PRICE_MAX;
export const SLIDER_STEP = 100;

// Сетевые настройки API
export const API_BASE_URL = 'https://25.javascript.htmlacademy.pro/keksobooking';
export const API_GET_URL = `${API_BASE_URL}/data`;
export const API_POST_URL = API_BASE_URL;
export const API_TIMEOUT_MS = 10000;

// Вспомогательные задержки
export const DEBOUNCE_DELAY_MS = 500;
export const THROTTLE_INTERVAL_MS = 300;

// Допустимые типы файлов изображений
export const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'];

// Клавиши
export const KEY_ESCAPE = 'Escape';
export const KEY_ENTER = 'Enter';

// ID шаблонов в DOM
export const TEMPLATE_ID_CARD = 'card';
export const TEMPLATE_ID_SUCCESS = 'success';
export const TEMPLATE_ID_ERROR = 'error';

