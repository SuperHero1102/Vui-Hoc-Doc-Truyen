import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Đăng ký Service Worker PWA thông minh với chế độ lưu trữ bền vững và tải ngầm không gián đoạn
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // 1. Xin quyền lưu trữ bền vững và kiểm tra dung lượng định mức
    if (navigator.storage) {
      if (navigator.storage.persist) {
        navigator.storage.persist().then((isPersisted) => {
          console.log('[PWA Storage] Persistent storage granted:', isPersisted);
        }).catch(() => {});
      }
      if (navigator.storage.persisted) {
        navigator.storage.persisted().then((isPersisted) => {
          console.log('[PWA Storage] Currently persisted:', isPersisted);
        }).catch(() => {});
      }
      if (navigator.storage.estimate) {
        navigator.storage.estimate().then((estimate) => {
          const usedMB = Math.round((estimate.usage || 0) / (1024 * 1024));
          const quotaMB = Math.round((estimate.quota || 0) / (1024 * 1024));
          console.log(`[PWA Storage] Quota estimate: ${usedMB} MB used of ${quotaMB} MB`);
        }).catch(() => {});
      }
    }

    // 2. Đăng ký Service Worker với phạm vi tương đối './'
    const swUrl = new URL('sw-offline.js', window.location.href).pathname;
    navigator.serviceWorker.register(swUrl, { scope: './' })
      .then((registration) => {
        // Kích hoạt tiến trình tải ngầm theo khối tài nguyên ngay khi SW sẵn sàng
        const triggerBackgroundSync = () => {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'START_BACKGROUND_CACHE' });
          } else if (registration.active) {
            registration.active.postMessage({ type: 'START_BACKGROUND_CACHE' });
          }
        };

        // Kích hoạt nhẹ nhàng sau 1.5 giây để nhường toàn bộ tài nguyên khởi động cho màn hình chính
        setTimeout(triggerBackgroundSync, 1500);

        // Khi có mạng trở lại, tự động kiểm tra bản cập nhật và tiếp tục tải các khối còn thiếu
        window.addEventListener('online', () => {
          registration.update().catch(() => {});
          setTimeout(triggerBackgroundSync, 500);
        });
      })
      .catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(<App />);
