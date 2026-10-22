'use strict';
importScripts('store-1.js','store-2.js','store-3.js','store-4.js','store-5.js','store-6.js','store-7.js');
const STORE = Object.assign({}, ...self.__SP);

const CACHE = 'fpau-assets-v1';
function mimeFor(name){ return name.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'; }
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){
  var m = new URL(e.request.url).pathname.match(/\/assets\/([A-Za-z0-9_.-]+)$/);
  if(!m || !(m[1] in STORE)) return;
  e.respondWith((async function(){
    var cache = await caches.open(CACHE);
    var key = new Request(e.request.url, {method:'GET'});
    var hit = await cache.match(key);
    if(hit) return hit;
    var b64 = STORE[m[1]].split(',')[1];
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for(var i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
    var resp = new Response(bytes, {headers:{'Content-Type': mimeFor(m[1]), 'Cache-Control':'public, max-age=31536000, immutable'}});
    cache.put(key, resp.clone());
    return resp;
  })());
});
