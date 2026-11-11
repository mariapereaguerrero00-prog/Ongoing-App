// Permite abrir On Going sin conexión. Para publicar cambios, sube el nuevo index.html.
const CACHE = "on-going-v2";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png", "./Barlow-Medium.ttf", "./Barlow-Regular.ttf", "./Barlow-SemiBold.ttf", "./BarlowCondensed-Bold.ttf", "./BarlowCondensed-Medium.ttf", "./BarlowCondensed-SemiBold.ttf", "./CormorantGaramond-VF.ttf", "./EBGaramond-VF.ttf", "./Jost-VF.ttf", "./PlayfairDisplay-VF.ttf"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", cp)); return res; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => {
    if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); }
    return res;
  })));
});
