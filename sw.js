const CHOOBKHAT_CACHE="choobkhat-shell-v32";
const CHOOBKHAT_SHELL=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./choobkhat-192.png",
  "./choobkhat-512.png",
  "./choobkhat-180.png",
  "./choobkhat-maskable-512.png"
];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CHOOBKHAT_CACHE).then(cache=>cache.addAll(CHOOBKHAT_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CHOOBKHAT_CACHE).map(key=>caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  if(event.request.mode==="navigate"){
    event.respondWith(
      fetch(event.request)
        .then(response=>{
          const copy=response.clone();
          caches.open(CHOOBKHAT_CACHE).then(cache=>cache.put("./",copy));
          return response;
        })
        .catch(()=>caches.match("./"))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
      if(response.ok){
        const copy=response.clone();
        caches.open(CHOOBKHAT_CACHE).then(cache=>cache.put(event.request,copy));
      }
      return response;
    }))
  );
});
