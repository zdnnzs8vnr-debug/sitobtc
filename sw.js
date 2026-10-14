const VERSION = 'ge-v5-3-2026';
const CORE = 'ge-core-' + VERSION;
const RUNTIME = 'ge-rt-' + VERSION;

const LOCAL_ASSETS = ['./','./index.html','./404.html','./manifest.webmanifest','./robots.txt','./humans.txt','./sitemap.xml'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CORE);
    await Promise.allSettled(LOCAL_ASSETS.map(u => c.add(new Request(u, { cache:'reload' }))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => k !== CORE && k !== RUNTIME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const isExternal = u => u.origin !== self.location.origin;
const isMedia = p => /\.(png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot)$/i.test(p);

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let url; try { url = new URL(req.url); } catch (e) { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if (isExternal(url)) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        (await caches.open(CORE)).put('./index.html', fresh.clone());
        return fresh;
      } catch (e) {
        const c = await caches.open(CORE);
        const hit = (await c.match('./index.html')) || (await c.match('./'));
        if (hit) return hit;
        return new Response(
          '<!doctype html><meta charset="utf-8"><title>offline</title><body style="background:#05060d;color:#ffb020;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh">NODO OFFLINE · ricarica quando torni online</body>',
          { headers:{ 'Content-Type':'text/html; charset=utf-8' } });
      }
    })());
    return;
  }

  if (isMedia(url.pathname) || /\.(css|js|json|webmanifest|txt|xml)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const c = await caches.open(RUNTIME);
      const hit = await c.match(req);
      if (hit) {
        fetch(req).then(r => { if (r && r.status===200 && r.type==='basic') c.put(req, r.clone()); }).catch(()=>{});
        return hit;
      }
      try {
        const r = await fetch(req);
        if (r && r.status===200 && r.type==='basic') c.put(req, r.clone());
        return r;
      } catch (e) { return new Response('', { status:504, statusText:'offline' }); }
    })());
    return;
  }

  event.respondWith((async () => {
    const c = await caches.open(RUNTIME);
    const hit = await c.match(req);
    const net = fetch(req).then(r => { if (r && r.status===200 && r.type==='basic') c.put(req, r.clone()); return r; }).catch(()=>hit);
    return hit || net;
  })());
});

self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'SKIP_WAITING') self.skipWaiting();
  if (d.type === 'PURGE') e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))));
});
