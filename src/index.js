import { extractLaunchParams, handleLaunch } from './utils';

// -------- РЕГИСТРИРУЕМ ОБРАБОТЧИКИ НЕМЕДЛЕННО (до main) --------

// Коды синей кнопки (из ui.js)
const BLUE_KEY_CODES = [406, 167, 191];

function isBlueButton(event) {
  return BLUE_KEY_CODES.includes(event.charCode) || BLUE_KEY_CODES.includes(event.keyCode);
}

// Функция перезагрузки
function reloadPage() {
  try {
    // Пытаемся показать уведомление (если функция уже определена)
    if (typeof window.ytaf_showNotification === 'function') {
      window.ytaf_showNotification('Перезагрузка...', 1500, 'blue');
    } else {
      console.log('Синяя кнопка: перезагрузка...');
    }
  } catch (e) {}

  // Несколько способов перезагрузки на случай, если один не сработает
  setTimeout(() => {
    try {
      window.location.replace(window.location.href);
    } catch (e) {
      try {
        window.location.href = window.location.href;
      } catch (e2) {
        window.location.reload();
      }
    }
  }, 100);
}

// Обработчик синей кнопки
function blueButtonHandler(event) {
  if (isBlueButton(event)) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'keydown') {
      reloadPage();
    }
    return false;
  }
  return true;
}

// Регистрируем обработчики на всех трёх фазах (keydown, keypress, keyup) с захватом
window.addEventListener('keydown', blueButtonHandler, true);
window.addEventListener('keypress', blueButtonHandler, true);
window.addEventListener('keyup', blueButtonHandler, true);

// Дублируем на случай, если захват не сработает – на фазе всплытия (но с более низким приоритетом)
window.addEventListener('keydown', blueButtonHandler, false);
window.addEventListener('keypress', blueButtonHandler, false);
window.addEventListener('keyup', blueButtonHandler, false);

console.log('[YTAF] Обработчики синей кнопки зарегистрированы.');

// -------- ПЕРЕХВАТ ОШИБОК СЕТИ --------
window.addEventListener('error', (event) => {
  const msg = event.message || '';
  if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('networkerror')) {
    console.warn('[YTAF] Сетевая ошибка – пробуем запустить интерфейс принудительно.');
    try {
      handleLaunch(extractLaunchParams());
    } catch (e) {
      console.error('[YTAF] Не удалось запустить интерфейс:', e);
    }
  }
}, true);

// -------- ОСНОВНАЯ ФУНКЦИЯ ЗАПУСКА --------
function main() {
  console.log('[YTAF] main() started.');
  try {
    handleLaunch(extractLaunchParams());
  } catch (error) {
    console.error('[YTAF] Ошибка при первом запуске:', error);
  }

  // Кнопка "1" для перезагрузки (оставляем как резерв)
  window.addEventListener('keydown', (event) => {
    if (event.keyCode === 49 || event.key === '1') {
      window.location.reload();
      event.preventDefault();
    }
  });
}

// Запускаем main после того, как DOM будет готов, но если DOM уже готов – сразу
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
