import {
  API_GET_URL,
  API_POST_URL,
  API_TIMEOUT_MS,
} from './constants.js';

function fetchWithTimeout(url, options = {}, timeoutMs = API_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(id));
}

export async function getAds() {
  try {
    const response = await fetchWithTimeout(API_GET_URL);
    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Не удалось загрузить объявления. ${error.message}`);
  }
}

export async function sendAd(formData) {
  try {
    const response = await fetchWithTimeout(API_POST_URL, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      // Пробуем получить текст ошибки от сервера
      let details = '';
      try {
        details = await response.text();
      } catch (_) { /* ignore */ }
      throw new Error(`Ошибка отправки формы: ${response.status} ${response.statusText}${details ? ` — ${details}` : ''}`);
    }
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }
    // На некоторых стендах успешный ответ может быть пустым/текстовым
    try {
      return await response.text();
    } catch (_) {
      return null;
    }
  } catch (error) {
    throw new Error(`Не удалось отправить форму. ${error.message}`);
  }
}


