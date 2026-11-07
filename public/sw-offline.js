/**
 * Service Worker PWA Chuẩn - Hoạt động 100% Offline & Tự động Cập nhật Ngầm Nguyên tử (Atomic Update)
 * Ứng dụng: Bé Vui Học Tiếng Anh (Vui Học Đọc Truyện)
 * 
 * Tuân thủ nghiêm ngặt:
 * 1. Hoạt động offline và online hoàn toàn đồng nhất, không gián đoạn, không lỗi 404/503.
 * 2. Tương thích đa nền tảng: chạy chuẩn cả domain gốc (localhost, Vercel) lẫn subpath GitHub Pages (/Vui-Hoc-Doc-Truyen/).
 * 3. Atomic Update: tải ngầm từng khối vào bộ nhớ tạm (staging); chỉ áp dụng khi ĐÃ TẢI ĐỦ 100%; tải lỗi/ngắt mạng giữ nguyên bản cũ.
 * 4. Tự phục hồi (Self-recovery): mở app tự kiểm tra tài nguyên thiếu để tải bù ngầm.
 * 5. Tuyệt đối không xóa hay ảnh hưởng đến tiến độ học tập, hồ sơ và cài đặt của bé (lưu trong LocalStorage).
 */

const CACHE_PREFIX = 'vui-hoc-pwa-v5';
const STATIC_CACHE = `${CACHE_PREFIX}-static`;
const MEDIA_CACHE = `${CACHE_PREFIX}-media`;

const CORE_SHELL_FILES = [
  '',
  'index.html',
  'manifest.webmanifest',
  'version.json',
  'icon.svg',
  'apple-touch-icon.png',
  'pwa-192x192.png',
  'pwa-512x512.png',
  'pwa-maskable-512x512.png',
  'fonts/fonts.css'
];

// Helper giải quyết đường dẫn tuyệt đối chuẩn xác theo phạm vi đăng ký (registration scope)
function getScopedUrl(rel) {
  const cleanRel = String(rel || '').replace(/^\.?\//, '');
  const scope = self.registration ? self.registration.scope : (self.location.origin + '/');
  return new URL(cleanRel, scope).pathname;
}

// 1. Cài đặt Service Worker: Precache vỏ ứng dụng cốt lõi & Priority 1 (JS, CSS, Font)
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

      // Tải và precache Priority 1 từ version.json
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

// Trạng thái tiến trình tải ngầm
let isBackgroundCaching = false;

// 3. Cơ chế tải ngầm nguyên tử theo khối (Atomic Batch Background Caching)
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

    const newVersionData = await versionRes.json().catch(() => null);
    if (!newVersionData || !newVersionData.priorities) {
      isBackgroundCaching = false;
      return;
    }

    // Kiểm tra cờ ngắt khẩn cấp (Emergency Kill-Switch)
    if (newVersionData.killSwitch === true) {
      console.warn('[SW] Emergency kill-switch active! Clearing caches...');
      const keys = await caches.keys();
      for (const k of keys) {
        if (k.startsWith('vui-hoc-')) await caches.delete(k);
      }
      isBackgroundCaching = false;
      return;
    }

    const staticCache = await caches.open(STATIC_CACHE);
    const mediaCache = await caches.open(MEDIA_CACHE);

    // Đọc phiên bản đang hoạt động trong cache
    const cachedVersionRes = await staticCache.match(vUrl);
    const currentVersionData = cachedVersionRes ? await cachedVersionRes.json().catch(() => null) : null;

    const { priority1 = [], priority2 = [], priority3 = [] } = newVersionData.priorities;
    const downloadQueue = [...priority1, ...priority2, ...priority3];

    const isNewVersion = !currentVersionData || currentVersionData.version !== newVersionData.version;

    if (!isNewVersion) {
      // CÙNG PHIÊN BẢN: Kiểm tra tự phục hồi (Self-recovery) các tệp còn thiếu nếu lần trước bị ngắt mạng
      const BATCH_SIZE = 4;
      const DELAY_BETWEEN_BATCHES_MS = 40;

      for (let i = 0; i < downloadQueue.length; i += BATCH_SIZE) {
        const batch = downloadQueue.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (relPath) => {
            const url = getScopedUrl(relPath);
            try {
              const existing = (await caches.match(url)) || (await caches.match(new Request(url)));
              if (existing) return;

              const res = await fetch(url, { cache: 'no-cache' });
              if (res && res.status === 200) {
                const targetCache = url.includes('/assets/music/') || url.includes('.jpg') || url.includes('.png') || url.includes('.webp') || url.includes('.mp3')
                  ? mediaCache
                  : staticCache;
                await targetCache.put(url, res.clone());
              }
            } catch {}
          })
        );
        await new Promise((r) => setTimeout(r, DELAY_BETWEEN_BATCHES_MS));
      }

      // Lưu lại version.json chuẩn vào cache
      await staticCache.put(vUrl, new Response(JSON.stringify(newVersionData), {
        headers: { 'Content-Type': 'application/json' }
      }));
    } else {
      // PHIÊN BẢN MỚI: Tải nguyên tử qua Staging Cache
      // Chỉ tải file có thay đổi hash; file giữ nguyên hash được tái sử dụng từ cache cũ
      console.log(`[SW] New version detected: ${newVersionData.version}. Starting atomic download...`);
      const stagingCacheName = `${CACHE_PREFIX}-staging-${newVersionData.coreHash || Date.now()}`;
      const stagingCache = await caches.open(stagingCacheName);

      let allSucceeded = true;
      const BATCH_SIZE = 4;
      const DELAY_BETWEEN_BATCHES_MS = 40;

      for (let i = 0; i < downloadQueue.length; i += BATCH_SIZE) {
        const batch = downloadQueue.slice(i, i + BATCH_SIZE);

        await Promise.all(
          batch.map(async (relPath) => {
            const url = getScopedUrl(relPath);
            try {
              const oldHash = currentVersionData?.files?.[relPath];
              const newHash = newVersionData?.files?.[relPath];

              // 1. Nếu hash không đổi và đã có trong cache cũ -> sao chép trực tiếp, không tốn mạng
              if (oldHash && newHash && oldHash === newHash) {
                const existing = await caches.match(url);
                if (existing) {
                  await stagingCache.put(url, existing.clone());
                  return;
                }
              }

              // 2. File mới hoặc đã thay đổi nội dung -> tải từ mạng
              const res = await fetch(url, { cache: 'no-cache' });
              if (res && res.status === 200) {
                await stagingCache.put(url, res.clone());
              } else {
                allSucceeded = false;
              }
            } catch (err) {
              allSucceeded = false;
            }
          })
        );

        await new Promise((r) => setTimeout(r, DELAY_BETWEEN_BATCHES_MS));
      }

      // CHỈ KHI TẢI ĐỦ 100% MỚI ÁP DỤNG BẢN MỚI (Atomic commit)
      if (allSucceeded) {
        console.log(`[SW] Atomic download complete for version ${newVersionData.version}. Applying update...`);
        const stagingKeys = await stagingCache.keys();
        for (const req of stagingKeys) {
          const res = await stagingCache.match(req);
          if (res) {
            const u = req.url;
            const targetCache = u.includes('/assets/music/') || u.includes('.jpg') || u.includes('.png') || u.includes('.webp') || u.includes('.mp3')
              ? mediaCache
              : staticCache;
            await targetCache.put(req, res);
          }
        }
        await staticCache.put(vUrl, new Response(JSON.stringify(newVersionData), {
          headers: { 'Content-Type': 'application/json' }
        }));
        await caches.delete(stagingCacheName);
        console.log('[SW] Update applied successfully and staging cleared.');
      } else {
        console.warn('[SW] Atomic download incomplete (connection drop). Retaining current active version.');
        // Giữ lại bản staging để lần có mạng tiếp theo tải tiếp, không áp dụng nửa vời
      }
    }
  } catch (err) {
    console.warn('[SW] Background cache partial cycle:', err);
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

// 4. Bộ định tuyến Fetch: Cache-First hoàn toàn cho mọi tài nguyên tĩnh, media, font, shell
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Chỉ can thiệp các yêu cầu GET http/https
  if (req.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Bỏ qua WebSocket ping hoặc API backend động
  if (url.search.includes('token=') || url.pathname.includes('/api/')) {
    return;
  }

  // A. Xử lý tệp version.json: Network-First nhanh (2s), fallback Cache khi mất mạng
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

  // B. Xử lý điều hướng trang (Navigation / Mở app / Reload trang)
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        // Nếu có mạng: thử lấy nhanh trong 1.2s để nhận bản cập nhật mới nhất
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1200);
          const networkRes = await fetch(req, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (networkRes && networkRes.ok) {
            const clone = networkRes.clone();
            const c = await caches.open(STATIC_CACHE);
            c.put(getScopedUrl('index.html'), clone).catch(() => {});
            return networkRes;
          }
        } catch {}

        // Mất mạng hoặc mạng chậm: trả về index.html từ cache ngay lập tức (100% Offline)
        const cached =
          (await caches.match(getScopedUrl('index.html'))) ||
          (await caches.match(getScopedUrl(''))) ||
          (await caches.match('/index.html')) ||
          (await caches.match('/')) ||
          (await caches.match(req));
        if (cached) return cached;

        // Trang thông báo offline nhẹ nhàng nếu chưa từng tải
        return new Response(
          '<!doctype html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Bé Vui Học</title><style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#F5F9FC;color:#1E293B;text-align:center;padding:20px}h1{font-size:24px;color:#1E88E5}p{font-size:16px;color:#64748B}</style></head><body><div><h1>🎒 Bé Vui Học Đọc Truyện</h1><p>Ứng dụng đã sẵn sàng. Vui lòng kết nối Internet một lần để tải kho học liệu cho bé.</p></div></body></html>',
          { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      })()
    );
    return;
  }

  // C. Xử lý toàn bộ tài nguyên tĩnh, media, nhạc, font (Cache-First siêu tốc)
  event.respondWith(
    (async () => {
      // 1. Tìm trong cache trước (đối sánh cả Request, URL đầy đủ, và relative pathname)
      const cached =
        (await caches.match(req)) ||
        (await caches.match(req.url)) ||
        (await caches.match(url.pathname)) ||
        (await caches.match(getScopedUrl(url.pathname)));

      if (cached) return cached;

      // 2. Chưa có trong cache: tải từ mạng và tự động lưu vào cache phù hợp
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
        // Khi mất mạng: đối sánh lại theo pathname lần cuối
        const fallback =
          (await caches.match(url.pathname)) ||
          (await caches.match(getScopedUrl(url.pathname))) ||
          (await caches.match(req.url));
        if (fallback) return fallback;

        // Fallback nhẹ cho ảnh nếu bị thiếu
        if (req.destination === 'image') {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#E2E8F0"/><text x="50" y="55" font-size="28" text-anchor="middle" fill="#94A3B8">🎵</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
        return new Response('Offline', { status: 503 });
      }
    })()
  );
});
