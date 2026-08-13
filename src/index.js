// -------- ОБРАБОТЧИКИ КНОПОК --------
const BLUE_KEY_CODES = [406, 167, 191];

function isBlueButton(event) {
  return BLUE_KEY_CODES.includes(event.charCode) || BLUE_KEY_CODES.includes(event.keyCode);
}

// Перезагрузка iframe или всей страницы
function reloadIframe() {
  const iframe = document.getElementById('youtube-tv-iframe');
  if (iframe) {
    try {
      iframe.contentWindow.location.reload();
      console.log('[YTAF] Iframe перезагружен');
    } catch (e) {
      console.warn('[YTAF] Не удалось перезагрузить iframe, перезагружаем страницу', e);
      window.location.reload();
    }
  } else {
    window.location.reload();
  }
}

// Обработчик синей кнопки
function blueButtonHandler(event) {
  if (isBlueButton(event)) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'keydown') {
      reloadIframe();
    }
    return false;
  }
  return true;
}

// Регистрация на всех фазах (захват и всплытие)
window.addEventListener('keydown', blueButtonHandler, true);
window.addEventListener('keypress', blueButtonHandler, true);
window.addEventListener('keyup', blueButtonHandler, true);
window.addEventListener('keydown', blueButtonHandler, false);
window.addEventListener('keypress', blueButtonHandler, false);
window.addEventListener('keyup', blueButtonHandler, false);

// Кнопка "1" – перезагрузка всей страницы (резерв)
window.addEventListener('keydown', (event) => {
  if (event.keyCode === 49 || event.key === '1') {
    window.location.reload();
    event.preventDefault();
  }
});

console.log('[YTAF] Обработчики синей кнопки и "1" зарегистрированы.');

// -------- СОЗДАНИЕ IFRAME С YOUTUBE TV --------
function createYouTubeTV() {
  // Очищаем body и устанавливаем iframe на весь экран
  document.body.innerHTML = '';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflow = 'hidden';
  document.body.style.background = '#000';

  const iframe = document.createElement('iframe');
  iframe.id = 'youtube-tv-iframe';
  iframe.src = 'https://www.youtube.com/tv';
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.allow = 'fullscreen; autoplay; encrypted-media;';
  iframe.setAttribute('allowfullscreen', 'true');

  document.body.appendChild(iframe);
  console.log('[YTAF] YouTube TV загружен в iframe');
}

// Запускаем создание iframe после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createYouTubeTV);
} else {
  createYouTubeTV();
}
