import { DEFAULT_DECIMAL_PRECISION } from './constants.js';

/**
 * Возвращает случайное число с плавающей точкой из переданного диапазона включительно
 * @param {number} min - Минимальное значение диапазона
 * @param {number} max - Максимальное значение диапазона
 * @param {number} [digits=DEFAULT_DECIMAL_PRECISION]  - Количество знаков после запятой согласно ТЗ
 * @returns {number} Случайное число с плавающей точкой
 * @throws {Error} Если передан отрицательный диапазон или некорректные параметры
 */
function getRandomFloat(min, max, [digits=DEFAULT_DECIMAL_PRECISION]) {
	// Проверяем, что параметры являются числами
	if (typeof min !== 'number' || typeof max !== 'number' || isNaN(min) || isNaN(max)) {
	  throw new Error('Параметры min и max должны быть числами');
	}

	// Проверяем, что digits является положительным целым числом
	if (!Number.isInteger(digits) || digits < 0) {
	  throw new Error('Параметр digits должен быть неотрицательным целым числом');
	}

	// Проверяем условие на положительный диапазон
	if (min < 0 || max < 0) {
	  throw new Error('Диапазон должен быть положительным, включая ноль');
	}

	// Проверяем порядок значений и корректируем при необходимости
	if (min > max) {
	  [min, max] = [max, min];
	} else if (min === max) {
	  return Number(min.toFixed(digits));
	}

	// Генерируем случайное число в диапазоне [0, 1)
	const randomValue = Math.random();

	// Масштабируем случайное число к нужному диапазону [min, max]
	const scaledValue = randomValue * (max - min) + min;

	// Округляем до нужного количества знаков после запятой
	return Number(scaledValue.toFixed(digits));
  }


  /**
 * Возвращает случайное целое число из переданного диапазона включительно
 * @param {number} min - Минимальное значение диапазона
 * @param {number} max - Максимальное значение диапазона
 * @returns {number} Случайное целое число
 */
function getRandomInteger(min, max) {
	// Проверяем, что min меньше max и корректируем при необходимости
	// Math.ceil округляет до ближайшего большего целого
	const lower = Math.ceil(Math.min(min, max));

	// Math.floor округляет до ближайшего меньшего целого
	const upper = Math.floor(Math.max(min, max));

	// Генерируем случайное число в диапазоне [0, 1) и масштабируем к диапазону [lower, upper]
	// Добавляем +1, чтобы включить верхнюю границу (upper) в возможные результаты
	const result = Math.random() * (upper - lower + 1) + lower;

	// Округляем до ближайшего меньшего целого, чтобы получить целое число
	return Math.floor(result);
  }
  export {
	getRandomFloat,
	getRandomInteger
  }
