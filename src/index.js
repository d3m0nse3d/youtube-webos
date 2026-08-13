import { extractLaunchParams, handleLaunch } from './utils';

// --- Обработчик синей кнопки (дублируем из ui.js) ---
const BLUE_KEY_CODES = [406, 167, 191]; // коды синей кнопки

function isBlueButton(event) {
  return BLUE_KEY_CODES.includes(event.charCode) || BLUE_KEY_CODES.includes(event.keyCode);
}

function handleBlueButton(event) {
  if (isBlueButton(event)) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'keydown') {
      // Показываем уведомление (если функция доступна)
      if (typeof window.ytaf_showNotification === 'function') {
        window.ytaf_showNotification('Перезагрузка...', 1500, 'blue');
      } else {
        // fallback: простой alert
        alert('Перезагрузка...');
      }
      // Перезагрузка страницы
      setTimeout(() => {
        window.location.replace(window.location.href);
      }, 100);
    }
    return false;
  }
  return true;
}

// --- Перехват ошибок сети ---
function setupNetworkErrorHandler() {
  window.addEventListener('error', (event) => {
    if (
      event.message?.toLowerCase().includes('network') ||
      event.message?.toLowerCase().includes('networkerror')
    ) {
      console.warn('Обнаружена сетевая ошибка. Принудительно запускаем интерфейс...');
      try {
        handleLaunch(extractLaunchParams());
      } catch (e) {
        console.error('Не удалось запустить интерфейс:', e);
      }
    }
  }, true);
}

// --- Основная функция ---
function main() {
  // Обработчик ошибок сети
  setupNetworkErrorHandler();

  // Запуск приложения
  try {
    handleLaunch(extractLaunchParams());
  } catch (error) {
    console.error('Ошибка при первом запуске:', error);
  }

  // --- Глобальные обработчики клавиш ---

  // 1. Кнопка "1" для перезагрузки (оставляем как было)
  window.addEventListener('keydown', (event) => {
    if (event.keyCode === 49 || event.key === '1') {
      window.location.reload();
      event.preventDefault();
    }
  });

  // 2. Синяя кнопка для перезагрузки (дублируем из ui.js)
  window.addEventListener('keydown', handleBlueButton, true);
  window.addEventListener('keypress', handleBlueButton, true);
  window.addEventListener('keyup', handleBlueButton, true);
}

main();
