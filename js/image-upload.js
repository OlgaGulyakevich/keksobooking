import { IMAGE_FILE_TYPES } from './constants.js';

const form = document.querySelector('.ad-form');
const avatarInput = /** @type {HTMLInputElement} */ (form.querySelector('#avatar'));
const avatarPreviewImg = /** @type {HTMLImageElement} */ (form.querySelector('.ad-form-header__preview img'));
const imagesInput = /** @type {HTMLInputElement} */ (form.querySelector('#images'));
const photosContainerRoot = form.querySelector('.ad-form__photo-container');
const firstPhotoSlot = form.querySelector('.ad-form__photo');
const dropZone = form.querySelector('.ad-form__drop-zone');

const DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';
const displayedPhotoKeys = new Set();

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
  // Больше не очищаем уже добавленные превью: добавляем новые, без дублей
  let isFirstFilled = Boolean(firstPhotoSlot && firstPhotoSlot.children.length > 0);
  for (const file of files) {
    if (!isValidFileType(file)) continue;
    const key = `${file.name}:${file.size}:${file.lastModified}`;
    if (displayedPhotoKeys.has(key)) continue;
    try {
      const url = await readAsDataURL(file);
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Предпросмотр фото жилья';
      img.style.width = '70px';
      img.style.height = '70px';
      img.style.objectFit = 'cover';

      if (!isFirstFilled && firstPhotoSlot) {
        firstPhotoSlot.appendChild(img);
        isFirstFilled = true;
      } else if (photosContainerRoot) {
        const wrapper = document.createElement('div');
        wrapper.className = 'ad-form__photo';
        wrapper.appendChild(img);
        photosContainerRoot.appendChild(wrapper);
      }
      displayedPhotoKeys.add(key);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Не удалось прочитать файл фото', e);
    }
  }
}

export function initImageUpload() {
  if (avatarInput) avatarInput.addEventListener('change', handleAvatarChange);
  if (imagesInput) imagesInput.addEventListener('change', handleImagesChange);
  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    dropZone.addEventListener('drop', async (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files || []);
      if (!files.length) return;
      imagesInput.files = e.dataTransfer.files;
      await handleImagesChange();
    });
  }
  // Drag&Drop для аватара
  const avatarDrop = form.querySelector('.ad-form-header__drop-zone');
  if (avatarDrop) {
    avatarDrop.addEventListener('dragover', (e) => e.preventDefault());
    avatarDrop.addEventListener('drop', async (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files || []);
      if (!files.length) return;
      const file = files[0];
      if (!isValidFileType(file)) return;
      avatarInput.files = e.dataTransfer.files;
      await handleAvatarChange();
    });
  }
}

export function resetImagePreviews() {
  if (avatarPreviewImg) avatarPreviewImg.src = DEFAULT_AVATAR_SRC;
  if (firstPhotoSlot) firstPhotoSlot.innerHTML = '';
  if (photosContainerRoot) {
    Array.from(photosContainerRoot.querySelectorAll('.ad-form__photo'))
      .slice(1)
      .forEach((node) => node.remove());
  }
  if (avatarInput) avatarInput.value = '';
  if (imagesInput) imagesInput.value = '';
  displayedPhotoKeys.clear();
}


