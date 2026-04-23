// ========================================
// Tobislab FLOW · Service Worker
// 전략: index.html = network-first (fresh), assets = cache-first
// 캐시 버전은 index.html 배포 시 자동으로 stale-while-revalidate
// ========================================
const CACHE = 'flow-v1';
const CORE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-32.png',
  '/icon-192.png',
  '/icon-512.png',
  '/og.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // GET만 캐시, 외부 도메인(YouTube/AdSense/Plausible) 통과
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // index.html / 루트 → network-first (새 배포 즉시 반영)
  if (url.pathname === '/' || url.pathname === '/index.html') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // 정적 에셋 → cache-first
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => cached))
  );
});
