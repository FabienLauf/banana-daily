/*
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.0/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
    workbox.routing.registerRoute(
        new RegExp('.*\.(?:js|css|png|jpg|jpeg|svg|gif)'),
        new workbox.strategies.NetworkFirst()
    );
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}
*/
const cacheName = 'shell-content';
const filesToCache = [
    '/stylesheets/style.css',
    '/images/buttons/install.svg',

    '/index.html',
    '/offline.html',

    '/'
];

self.addEventListener('install', function(evt) {
    console.log('[ServiceWorker] Install');
    evt.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
    self.skipWaiting();
});
self.addEventListener('activate', function(evt) {
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});
self.addEventListener('fetch', function(evt) {
    if (evt.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }
    evt.respondWith(
        fetch(evt.request)
            .catch(() => {
                return caches.open(cacheName)
                    .then((cache) => {
                        return cache.match('offline.html');
                    });
            })
    );
});
