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


// App Shell caching

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


// Offline mode

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


// Notification

/*
self.importScripts('https://www.gstatic.com/firebasejs/5.11.1/firebase-app.js');
self.importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyDQJ5XXKviVnuu7XnAV840mj1U2lSKqTjY",
    authDomain: "banana-daily.firebaseapp.com",
    databaseURL: "https://banana-daily.firebaseio.com",
    projectId: "banana-daily",
    storageBucket: "banana-daily.appspot.com",
    messagingSenderId: "614501899599",
    appId: "1:614501899599:web:18c838a45b9a55e8"
};

firebase.initializeApp(firebaseConfig);
var messaging = firebase.messaging();

messaging.onMessage(function(payload) {
    console.log('Message received. ', payload);
    // ...
});


messaging.requestPermission().then(function() {
    console.log('Notification permission granted.');
    // TODO(developer): Retrieve an Instance ID token for use with FCM.
    // ...
}).catch(function(err) {
    console.log('Unable to get permission to notify.', err);
});

messaging.getToken().then(function(currentToken) {
    if (currentToken) {
        sendTokenToServer(currentToken);
        updateUIForPushEnabled(currentToken);
    } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        updateUIForPushPermissionRequired();
        setTokenSentToServer(false);
    }
}).catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
    setTokenSentToServer(false);
});

messaging.onTokenRefresh(function() {
    messaging.getToken().then(function(refreshedToken) {
        console.log('Token refreshed.');
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        setTokenSentToServer(false);
        // Send Instance ID token to app server.
        sendTokenToServer(refreshedToken);
        // ...
    }).catch(function(err) {
        console.log('Unable to retrieve refreshed token ', err);
        showToken('Unable to retrieve refreshed token ', err);
    });
});

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    var notificationTitle = 'Background Message Title';
    var notificationOptions = {
        body: 'Background Message body.'

    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
self.addEventListener('push', e => {
    showNotification(e);
    /*
    clients.matchAll().then(client => {
        if (client.length === 0) {
            showNotification(e);
        } else {
            // Send a message to the page to update the UI
            console.log('Application is already open!');
        }
    });
});

function showNotification(e) {
    if(Notification.permission == 'granted') {
        // Show notification
        var body;
        if (e.data) {
            body = e.data.text();
        } else {
            body = 'Push message no payload';
        }
        var options = {
            body: body,
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        e.waitUntil(self.registration.showNotification('Hello world!', options));
    }
}
self.addEventListener('notificationclick', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow('http://www.example.com');
        notification.close();
    }
});
*/
