// Service worker: precaches every file of dist/ so the game runs fully offline once installed.
// The build replaces VERSION (content hash of all files) and ASSETS (file list); a new hash means a new
// cache, the old one is dropped on activation.
const VERSION = 'c5a891a858dd';
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

// Page navigations: network first (with a short timeout), so a reload after a deploy shows the new version
// right away; the fresh page replaces the cached one. Offline or slow network: the cached page.
// Everything else (fonts, icons, manifest): cache first, network as fallback.
const NAVIGATION_TIMEOUT_MS = 4000;

async function fromNetwork(request, cache) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), NAVIGATION_TIMEOUT_MS);
  try {
    const res = await fetch(request, { signal: ctrl.signal });
    if (res.ok && res.type === 'basic' && !res.redirected) await cache.put('./', res.clone());
    return res;
  } finally {
    clearTimeout(timer);
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      if (request.mode === 'navigate') {
        // Every page navigation inside the scope (./, ./index.html, ./?x) gets the game page.
        try {
          const res = await fromNetwork(request, cache);
          if (res.ok || res.type === 'opaqueredirect') return res;
        } catch {
          // offline or timed out
        }
        return (await cache.match('./')) || fetch(request);
      }
      return (await cache.match(request, { ignoreSearch: true })) || fetch(request);
    })(),
  );
});
