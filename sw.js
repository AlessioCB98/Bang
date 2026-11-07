importScripts('./offline-assets.js');

const prefix = new URL('./', self.location).href + 'cache-';
const cacheName = prefix + self.OFFLINE_VERSION;
const files = self.OFFLINE_FILES.map(path => new URL(path, self.location).href);
const cachedFiles = new Set(files);
const home = new URL('./', self.location).href;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache =>
    cache.addAll(files.map(url => new Request(url, { cache: 'reload' })))
  ));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(prefix) && key !== cacheName) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (!url.href.startsWith(home)) return;
  url.search = '';
  if (!cachedFiles.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    return await cache.match(url.href) || fetch(request);
  })());
});
