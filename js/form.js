import { sendAd } from './api.js';
import { initValidation, validateForm } from './validation.js';
import { showSuccessMessage, showErrorMessage } from './util.js';
import { resetMainPin, formatCoords } from './map.js';
import { MAP_CENTER, DEFAULT_DECIMAL_PRECISION } from './constants.js';

const form = document.querySelector('.ad-form');
const resetButton = form.querySelector('.ad-form__reset');
const addressInput = /** @type {HTMLInputElement} */ (form.querySelector('#address'));

function setDefaultAddress() {
  addressInput.value = formatCoords(MAP_CENTER);
}

function resetForm() {
  form.reset();
  resetMainPin();
  setDefaultAddress();
}

export function initForm() {
  initValidation();
  setDefaultAddress();

  form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    if (!validateForm()) return;

    const submitBtn = form.querySelector('.ad-form__submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    try {
      const formData = new FormData(form);
      await sendAd(formData);
      resetForm();
      showSuccessMessage();
    } catch (e) {
      showErrorMessage();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Опубликовать';
    }
  });

  resetButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    resetForm();
  });
}


