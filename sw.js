const V='survey-v6',SHELL=['./','index.html','manifest.json','css/styles.css','js/core.js','js/ui.js','js/leveling.js','js/earthworks.js','js/traverse-curves.js','js/gps.js','js/app.js','js/site.js','js/map.js','js/tools.js','js/tin-core.js','js/terrain.js','js/report.js','js/worker.js','js/main.js','icons/icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='tiles').map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url),tile=/tile|arcgisonline/.test(u.host+u.pathname);
e.respondWith(caches.match(r).then(h=>{if(h&&tile)return h;const f=fetch(r).then(n=>{if(n.ok||n.type==='opaque'){const cl=n.clone();caches.open(tile?'tiles':V).then(c=>c.put(r,cl))}return n}).catch(()=>h);return h||f}))});
