import { extractLaunchParams, handleLaunch } from './utils';

// -------- РЕГИСТРИРУЕМ ОБРАБОТЧИКИ НЕМЕДЛЕННО (до main) --------

// Коды синей кнопки (из ui.js)
const BLUE_KEY_CODES = [406, 167, 191];

function isBlueButton(event) {
  return BLUE_KEY_CODES.includes(event.charCode) || BLUE_KEY_CODES.includes(event.keyCode);
}

// Функция принудительного запуска интерфейса (без перезагрузки страницы)
function forceLaunch() {
  console.log('[YTAF] Принудительный запуск интерфейса...');
  try {
    handleLaunch(extractLaunchParams());
    return true;
  } catch (err) {
    console.error('[YTAF] Ошибка при запуске интерфейса:', err);
    return false;
  }
}

// Функция перезагрузки страницы (резерв)
function reloadPage() {
  console.log('[YTAF] Перезагрузка страницы...');
  try {
    window.location.reload();
  } catch (err) {
    console.error('[YTAF] Не удалось перезагрузить:', err);
    try {
      window.location.replace(window.location.href);
    } catch (err2) {
      console.error('[YTAF] И replace не сработал:', err2);
    }
  }
}

// Обработчик синей кнопки
function blueButtonHandler(event) {
  if (isBlueButton(event)) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'keydown') {
      // Сначала пытаемся запустить интерфейс без перезагрузки
      const launched = forceLaunch();
      // Если не вышло – перезагружаем страницу
      if (!launched) {
        reloadPage();
      }
    }
    return false;
  }
  return true;
}

// Регистрируем обработчики на всех фазах (захват и всплытие)
window.addEventListener('keydown', blueButtonHandler, true);
window.addEventListener('keypress', blueButtonHandler, true);
window.addEventListener('keyup', blueButtonHandler, true);
window.addEventListener('keydown', blueButtonHandler, false);
window.addEventListener('keypress', blueButtonHandler, false);
window.addEventListener('keyup', blueButtonHandler, false);

console.log('[YTAF] Обработчики синей кнопки зарегистрированы.');

// -------- ПЕРЕХВАТ ОШИБОК СЕТИ (автоматический запуск) --------
function handleNetworkError() {
  console.warn('[YTAF] Обнаружена сетевая ошибка – пробуем запустить интерфейс принудительно.');
  forceLaunch();
}

window.addEventListener('error', (event) => {
  const msg = event.message || '';
  if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('networkerror')) {
    handleNetworkError();
  }
}, true);

window.addEventListener('unhandledrejection', (event) => {
  const msg = event.reason?.message || '';
  if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('networkerror')) {
    handleNetworkError();
  }
}, true);

// -------- ОСНОВНАЯ ФУНКЦИЯ ЗАПУСКА --------
function main() {
  console.log('[YTAF] main() started.');
  try {
    handleLaunch(extractLaunchParams());
  } catch (error) {
    console.error('[YTAF] Ошибка при первом запуске:', error);
    // Если при первом запуске ошибка – пробуем повторить через секунду
    setTimeout(() => {
      forceLaunch();
    }, 1000);
  }

  // Кнопка "1" для перезагрузки (резерв)
  window.addEventListener('keydown', (event) => {
    if (event.keyCode === 49 || event.key === '1') {
      reloadPage();
      event.preventDefault();
    }
  });
}

// Запускаем main после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
