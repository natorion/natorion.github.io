// Service worker: precaches every file of dist/ so the game runs fully offline once installed.
// The build replaces VERSION (content hash of all files) and ASSETS (file list); a new hash means a new
// cache, the old one is dropped on activation. Strategy: cache first, network as fallback.
const VERSION = 'b8d33e02f4a0';
const ASSETS = ["./","manifest.webmanifest","fonts/alegreya-sans-latin-400-normal.woff2","fonts/alegreya-sans-latin-500-normal.woff2","fonts/alegreya-sans-latin-700-normal.woff2","fonts/germania-one-latin-400-normal.woff2","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons/icon.svg"];
const CACHE = `schnapsertal-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // cache: 'reload' bypasses the HTTP cache so a new version never precaches stale files.
      .then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('schnapsertal-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      // Every page navigation inside the scope (./, ./index.html, ./?x) gets the game page.
      const hit = request.mode === 'navigate' ? await cache.match('./') : await cache.match(request, { ignoreSearch: true });
      return hit || fetch(request);
    })(),
  );
});
