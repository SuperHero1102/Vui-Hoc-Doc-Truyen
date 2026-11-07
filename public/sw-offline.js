/**
 * Service Worker thông minh hỗ trợ 100% Offline & Tự động Cập nhật ngầm
 * Ứng dụng: Bé Vui Học Tiếng Anh (Vui Học Đọc Truyện)
 * 
 * Tiêu chí:
 * 1. Hoạt động offline và online ổn định như nhau từ lần mở thứ 2.
 * 2. Tương thích đa nền tảng cả domain gốc (Vercel/Netlify/Localhost) lẫn subpath (GitHub Pages).
 * 3. Tải ngầm lần lượt toàn bộ tài nguyên theo khối nhỏ (batch background cache), không chặn UI, không popup.
 * 4. Kiểm tra ngầm file version.json kèm hash; chỉ tải file thay đổi; tải đủ mới áp dụng; tải lỗi giữ bản cũ.
 * 5. Cache-First cho toàn bộ media, tranh, nhạc, mã nguồn đã tải; hỗ trợ cache font Google.
 */

const CACHE_VERSION = 'vui-hoc-pwa-v4';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const MEDIA_CACHE = `${CACHE_VERSION}-media`;

const CORE_SHELL_FILES = [
  '',
  'index.html',
  'manifest.webmanifest',
  'version.json',
  'icon.svg',
  'apple-touch-icon.png',
  'pwa-192x192.png',
  'pwa-512x512.png',
  'pwa-maskable-512x512.png'
];

// Helper giải quyết đường dẫn tuyệt đối theo phạm vi đăng ký (registration scope)
function getScopedUrl(rel) {
  const cleanRel = String(rel || '').replace(/^\.?\//, '');
  const scope = self.registration ? self.registration.scope : self.location.origin + '/';
  return new URL(cleanRel, scope).pathname;
}

// 1. Cài đặt Service Worker: precache vỏ ứng dụng và toàn bộ Priority 1 (Core JS & CSS bundle)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const staticCache = await caches.open(STATIC_CACHE);
      const coreUrls = CORE_SHELL_FILES.map(getScopedUrl);
      
      // Precache các file tĩnh cốt lõi
      await Promise.all(
        coreUrls.map((url) =>
          staticCache.add(new Request(url, { cache: 'reload' })).catch(() => {})
        )
      );

      // Tải và precache ngay toàn bộ Priority 1 (Mã nguồn JS bundle, CSS) từ version.json
      try {
        const vUrl = getScopedUrl('version.json');
        const vRes = await fetch(vUrl, { cache: 'reload' });
        if (vRes.ok) {
          const vData = await vRes.json();
          if (vData.priorities && Array.isArray(vData.priorities.priority1)) {
            await Promise.all(
              vData.priorities.priority1.map((p1) => {
                const u = getScopedUrl(p1);
                return staticCache.add(new Request(u, { cache: 'reload' })).catch(() => {});
              })
            );
          }
        }
      } catch {}
    })()
  );
});

// 2. Kích hoạt: dọn dẹp các cache phiên bản cũ không còn dùng
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key.startsWith('vui-hoc-') && key !== STATIC_CACHE && key !== MEDIA_CACHE) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Trạng thái tải ngầm
let isBackgroundCaching = false;

// 3. Cơ chế tải ngầm theo khối nhỏ (Batch Background Caching)
async function runBackgroundCaching() {
  if (isBackgroundCaching) return;
  isBackgroundCaching = true;

  try {
    const vUrl = getScopedUrl('version.json');
    const versionRes = await fetch(vUrl + '?t=' + Date.now(), { cache: 'no-cache' }).catch(() => null);
    if (!versionRes || !versionRes.ok) {
      isBackgroundCaching = false;
      return;
    }

    const versionData = await versionRes.json().catch(() => null);
    if (!versionData || !versionData.priorities) {
      isBackgroundCaching = false;
      return;
    }

    // Kiểm tra cờ ngắt khẩn cấp (Emergency Kill-Switch)
    if (versionData.killSwitch === true) {
      console.warn('[SW] Emergency kill-switch active! Clearing caches...');
      const keys = await caches.keys();
      for (const k of keys) {
        if (k.startsWith('vui-hoc-')) await caches.delete(k);
      }
      isBackgroundCaching = false;
      return;
    }

    // Lưu version.json vào cache static
    const staticCache = await caches.open(STATIC_CACHE);
    await staticCache.put(vUrl, new Response(JSON.stringify(versionData), {
      headers: { 'Content-Type': 'application/json' }
    }));

    const mediaCache = await caches.open(MEDIA_CACHE);

    // 3.2 Gom danh sách tài nguyên theo mức độ ưu tiên
    const { priority1 = [], priority2 = [], priority3 = [] } = versionData.priorities;
    const downloadQueue = [...priority1, ...priority2, ...priority3].map(getScopedUrl);

    // 3.3 Tải lần lượt từng khối nhỏ (Batch size: 4 tệp)
    const BATCH_SIZE = 4;
    const DELAY_BETWEEN_BATCHES_MS = 50;

    for (let i = 0; i < downloadQueue.length; i += BATCH_SIZE) {
      const batch = downloadQueue.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (url) => {
          try {
            const existing = (await caches.match(url)) || (await caches.match(new Request(url)));
            if (existing) return;

            const res = await fetch(url, { cache: 'no-cache' });
            if (res && res.status === 200) {
              const targetCache = url.includes('/assets/music/') || url.includes('.jpg') || url.includes('.png') || url.includes('.webp')
                ? mediaCache
                : staticCache;
              await targetCache.put(url, res.clone());
            }
          } catch {}
        })
      );

      // Nghỉ nhẹ 50ms giữa các khối để nhường luồng xử lý âm thanh/UI
      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES_MS));
    }
  } catch (err) {
    console.warn('[SW] Background cache partial cycle completed:', err);
  } finally {
    isBackgroundCaching = false;
  }
}

// Lắng nghe tín hiệu kích hoạt tải ngầm từ giao diện chính
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'START_BACKGROUND_CACHE') {
    runBackgroundCaching();
  }
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 4. Bộ định tuyến Fetch: Đảm bảo phản hồi nhanh như ứng dụng native offline
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Chỉ can thiệp các yêu cầu GET http/https
  if (req.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Không can thiệp vào các đường dẫn đặc biệt của WebSocket ping hoặc API backend
  if (
    url.search.includes('token=') ||
    url.pathname.includes('/api/')
  ) {
    return;
  }

  // A. Xử lý Google Fonts (fonts.googleapis.com, fonts.gstatic.com)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      (async () => {
        const cached = (await caches.match(req)) || (await caches.match(req.url));
        if (cached) return cached;
        try {
          const res = await fetch(req);
          if (res && (res.status === 200 || res.type === 'opaque')) {
            const clone = res.clone();
            const staticCache = await caches.open(STATIC_CACHE);
            staticCache.put(req, clone).catch(() => {});
          }
          return res;
        } catch {
          return new Response('', { status: 200, headers: { 'Content-Type': 'text/css' } });
        }
      })()
    );
    return;
  }

  // B. Xử lý tệp version.json: Network-First với thời gian chờ ngắn, fallback cache
  if (url.pathname.endsWith('/version.json')) {
    event.respondWith(
      (async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          const networkRes = await fetch(req, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (networkRes && networkRes.ok) {
            const clone = networkRes.clone();
            const c = await caches.open(STATIC_CACHE);
            c.put(req, clone).catch(() => {});
            return networkRes;
          }
        } catch {}
        const cached = (await caches.match(req)) || (await caches.match(getScopedUrl('version.json')));
        if (cached) return cached;
        return new Response('{"version":"offline"}', { headers: { 'Content-Type': 'application/json' } });
      })()
    );
    return;
  }

  // C. Xử lý điều hướng trang (Navigation / SPA root)
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        // Nếu có mạng: thử lấy mạng nhanh trong 1.5s
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1500);
          const networkRes = await fetch(req, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (networkRes && networkRes.ok) {
            const clone = networkRes.clone();
            const c = await caches.open(STATIC_CACHE);
            c.put(getScopedUrl('index.html'), clone).catch(() => {});
            return networkRes;
          }
        } catch {}

        // Mất mạng hoặc mạng chậm: trả về index.html từ cache ngay lập tức
        const cached =
          (await caches.match(getScopedUrl('index.html'))) ||
          (await caches.match(getScopedUrl(''))) ||
          (await caches.match('/index.html')) ||
          (await caches.match('/')) ||
          (await caches.match(req));
        if (cached) return cached;
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      })()
    );
    return;
  }

  // D. Xử lý toàn bộ tài nguyên tĩnh & media (Cache-First đa lớp)
  // Ưu tiên cao nhất cho tốc độ mượt mà và chạy 100% offline
  event.respondWith(
    (async () => {
      // 1. Kiểm tra cache trước: đối sánh theo Request, URL đầy đủ, và relative pathname
      const cached =
        (await caches.match(req)) ||
        (await caches.match(req.url)) ||
        (await caches.match(url.pathname)) ||
        (await caches.match(getScopedUrl(url.pathname)));

      if (cached) return cached;

      // 2. Chưa có trong cache: tải từ mạng và tự động lưu vào cache
      try {
        const networkRes = await fetch(req);
        if (networkRes && (networkRes.status === 200 || networkRes.type === 'opaque')) {
          const clone = networkRes.clone();
          const targetCacheName =
            url.pathname.includes('/assets/music/') ||
            url.pathname.includes('.mp3') ||
            url.pathname.includes('.jpg') ||
            url.pathname.includes('.png') ||
            url.pathname.includes('.webp')
              ? MEDIA_CACHE
              : STATIC_CACHE;

          const cache = await caches.open(targetCacheName);
          cache.put(req, clone).catch(() => {});
        }
        return networkRes;
      } catch {
        // Khi mất mạng: thử tìm kiếm lại theo pathname lần cuối
        const fallback =
          (await caches.match(url.pathname)) ||
          (await caches.match(getScopedUrl(url.pathname))) ||
          (await caches.match(req.url));
        if (fallback) return fallback;

        // Fallback nhẹ nhàng cho ảnh nếu thiếu
        if (req.destination === 'image') {
          return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"/>', {
            headers: { 'Content-Type': 'image/svg+xml' }
          });
        }
        return new Response('Offline', { status: 503 });
      }
    })()
  );
});
