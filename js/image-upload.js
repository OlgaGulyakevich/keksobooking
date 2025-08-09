import { IMAGE_FILE_TYPES } from './constants.js';

const form = document.querySelector('.ad-form');
const avatarInput = /** @type {HTMLInputElement} */ (form.querySelector('#avatar'));
const avatarPreviewImg = /** @type {HTMLImageElement} */ (form.querySelector('.ad-form-header__preview img'));
const imagesInput = /** @type {HTMLInputElement} */ (form.querySelector('#images'));
const photosContainer = form.querySelector('.ad-form__photo');

const DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';

function isValidFileType(file) {
  const fileName = file.name.toLowerCase();
  return IMAGE_FILE_TYPES.some((ext) => fileName.endsWith(`.${ext}`));
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function handleAvatarChange() {
  const file = avatarInput.files && avatarInput.files[0];
  if (!file || !isValidFileType(file)) {
    // игнорируем неподдерживаемые файлы
    return;
  }
  try {
    const url = await readAsDataURL(file);
    avatarPreviewImg.src = url;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Не удалось прочитать файл аватара', e);
  }
}

async function handleImagesChange() {
  const files = imagesInput.files ? Array.from(imagesInput.files) : [];
  if (!files.length) return;
  photosContainer.innerHTML = '';
  for (const file of files) {
    if (!isValidFileType(file)) continue;
    try {
      const url = await readAsDataURL(file);
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Предпросмотр фото жилья';
      img.style.width = '70px';
      img.style.height = '70px';
      img.style.objectFit = 'cover';
      photosContainer.appendChild(img);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Не удалось прочитать файл фото', e);
    }
  }
}

export function initImageUpload() {
  if (avatarInput) avatarInput.addEventListener('change', handleAvatarChange);
  if (imagesInput) imagesInput.addEventListener('change', handleImagesChange);
}

export function resetImagePreviews() {
  if (avatarPreviewImg) avatarPreviewImg.src = DEFAULT_AVATAR_SRC;
  if (photosContainer) photosContainer.innerHTML = '';
  if (avatarInput) avatarInput.value = '';
  if (imagesInput) imagesInput.value = '';
}


