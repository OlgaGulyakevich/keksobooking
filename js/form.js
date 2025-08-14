import { sendAd } from './api.js';
import { initValidation, validateForm } from './validation.js';
import { showSuccessMessage, showErrorMessage } from './util.js';
import { resetMainPin, formatCoords } from './map.js';
import { MAP_CENTER } from './constants.js';
import { initImageUpload, resetImagePreviews } from './image-upload.js';

const form = document.querySelector('.ad-form');
const resetButton = form.querySelector('.ad-form__reset');
const addressInput = /** @type {HTMLInputElement} */ (form.querySelector('#address'));
const filtersForm = document.querySelector('.map__filters');
const typeSelect = /** @type {HTMLSelectElement} */ (form.querySelector('#type'));

function setDefaultAddress() {
  addressInput.value = formatCoords(MAP_CENTER);
}

function resetForm() {
  form.reset();
  resetMainPin();
  setDefaultAddress();
  const openedPopup = document.querySelector('.leaflet-popup');
  if (openedPopup) openedPopup.remove();
  // Сброс фильтров и перерисовка меток
  if (filtersForm) {
    filtersForm.reset();
    filtersForm.dispatchEvent(new Event('change', { bubbles: true }));
  }
  // Синхронизация минимума цены и слайдера с текущим типом жилья
  if (typeSelect) {
    typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

export function initForm() {
  // Полностью отключаем встроенную валидацию браузера
  form.setAttribute('novalidate', 'novalidate');
  form.noValidate = true;
  
  // Отключаем валидацию для всех полей ввода
  const inputs = form.querySelectorAll('input[type="text"], input[type="number"]');
  inputs.forEach(input => {
    input.removeAttribute('required');
    input.setCustomValidity('');
  });
  
  initValidation();
  setDefaultAddress();
  initImageUpload();
  // Поле адреса запрещено для ручного редактирования
  addressInput.readOnly = true;

  form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    if (!validateForm()) {
      // Форсируем появление сообщений об ошибках под полями
      const firstInvalid = form.querySelector('.ad-form__element .ad-form__element--error');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const submitBtn = form.querySelector('.ad-form__submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    try {
      const formData = new FormData(form);
      await sendAd(formData);
      resetForm();
      resetImagePreviews();
      showSuccessMessage('Ваше объявление успешно размещено!');
    } catch (e) {
      // Показываем ошибку, данные формы не трогаем
      showErrorMessage(e?.message || 'Не удалось отправить форму. Проверьте соединение и попробуйте ещё раз.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Опубликовать';
    }
  });

  resetButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    resetForm();
    resetImagePreviews();
  });
}


