// PawAlert service worker. Verhoog VERSION bij ELKE wijziging aan de app, anders ziet niemand de update.
const VERSION='3.13';
const CACHE='pawalert-'+VERSION;
const SHELL=['./','index.html','privacy.html','manifest.webmanifest','pawalert-icon-192.png','pawalert-icon-512.png','favicon.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)))});
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('pawalert-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).catch(()=>caches.match('index.html'))));
});
