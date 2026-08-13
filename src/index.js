import { extractLaunchParams, handleLaunch } from './utils';
import { configRead, configAddChangeListener } from './config.js';

/**
 * Сопоставление кодов клавиш с названиями кнопок.
 * Используется для определения, какая кнопка была нажата.
 */
const KEY_MAP = {
  403: 'red',
  404: 'green',
  172: 'green',
  405: 'yellow',
  170: 'yellow',
  406: 'blue',
  167: 'blue',
  191: 'blue',
};

/**
 * Возвращает название цветной кнопки по её коду.
 * @param {number} keyCode Код клавиши
 * @returns {string | null} Название кнопки или null
 */
function getKeyColor(keyCode) {
  return KEY_MAP[keyCode] || null;
}

/**
 * Выполняет действие, назначенное на кнопку.
 * @param {string} action Название действия
 */
function executeAction(action) {
  switch (action) {
    case 'refresh_page':
      console.log('[YTAF] Перезагрузка страницы');
      window.location.reload();
      break;
    // Здесь можно добавить другие действия, если они понадобятся
    default:
      console.log('[YTAF] Неизвестное действие:', action);
  }
}

/**
 * Основной обработчик нажатий клавиш.
 * Проверяет, является ли нажатая клавиша цветной кнопкой,
 * и выполняет соответствующее действие из конфига.
 */
function keyHandler(event) {
  const color = getKeyColor(event.keyCode);
  if (!color) return; // Не цветная кнопка — игнорируем

  const action = configRead(`shortcut_key_${color}`);
  if (!action || action === 'none') return;

  event.preventDefault();
  event.stopPropagation();

  if (event.type === 'keydown') {
    executeAction(action);
  }
}

// --- Инициализация ---

function main() {
  // Запускаем основное приложение YouTube
  handleLaunch(extractLaunchParams());

  // Регистрируем глобальный обработчик для цветных кнопок
  window.addEventListener('keydown', keyHandler, true);
  window.addEventListener('keypress', keyHandler, true);
  window.addEventListener('keyup', keyHandler, true);

  // Подписываемся на изменения конфига, чтобы обработчик всегда
  // использовал актуальные настройки (опционально)
  ['red', 'green', 'blue'].forEach((color) => {
    configAddChangeListener(`shortcut_key_${color}`, () => {
      console.log(`[YTAF] Действие для кнопки ${color} обновлено`);
    });
  });

  console.log('[YTAF] Приложение запущено. Синяя кнопка: перезагрузка страницы');
}

main();
