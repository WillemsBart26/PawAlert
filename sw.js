// PawAlert service worker. Verhoog VERSION bij ELKE wijziging aan de app, anders ziet niemand de update.
const VERSION='3.20';
const CACHE='pawalert-'+VERSION;
const SHELL=['./','index.html','privacy.html','manifest.webmanifest','pawalert-icon-192.png','pawalert-icon-512.png','favicon.png','apple-touch-icon.png'];
// Installeer alleen als index.html echt bij deze VERSION hoort (voorkomt dat een verouderde kopie uit een CDN-cache wordt opgeslagen).
// Mislukt dit, dan probeert de browser het bij de volgende updatecontrole opnieuw.
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  for(const u of SHELL){
    const res=await fetch(u,{cache:'reload'});
    if(!res.ok)throw new Error('Kon '+u+' niet ophalen');
    if(u==='./'||u==='index.html'){const t=await res.clone().text();if(!t.includes('PawAlert V'+VERSION))throw new Error('index.html is nog niet de nieuwe versie')}
    await c.put(u,res);
  }
})())});
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('pawalert-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).catch(()=>caches.match('index.html'))));
});
