
const messages = ['I love you Banane! ❤️', 'Hello Banane!', 'kolo meeeee!', 'Eh! I see you ah!', 'You say me?', 'I say you lah!',
    'Plop plop plop', 'I love you like monkeys love bananas', 'Eh, ask me ask me!', 'Do you love me?', 'Arigato 🙇‍♂️'];

const options = {
    badge: '/images/icons/bananas.ico',
    icon: '/images/icons/icon-144x144.png',
    vibrate: [100, 50, 100],
    dir: 'auto',
    lang: 'en-US'
};

class CustomNotification {

    constructor() {
        if ('Notification' in window && navigator.serviceWorker) {
            Notification.requestPermission(status => {
                console.log('Notification permission status:', status);
                if (Notification.permission == 'granted') {
                    this.subscribeUser();
                }
            });
            navigator.serviceWorker.addEventListener('push', e => {
                displayNotification(e);
                /*
                 clients.matchAll().then(client => {
                 if (client.length === 0) {
                 showNotification(e);
                 } else {
                 // Send a message to the page to update the UI
                 console.log('Application is already open!');
                 }
                 */
            });
        }
    }

    displayNotification(event) {
        if (Notification.permission == 'granted') {
            navigator.serviceWorker.getRegistration().then(reg => {
                const message = messages[Math.floor(Math.random() * messages.length)];
                if (event.waitUntil) {
                    event.waitUntil(reg.showNotification(message, options));
                } else {
                    reg.showNotification(message, options);
                }
            });
        }
    }

    subscribeUser() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(reg => {
                reg.pushManager.subscribe({
                    userVisibleOnly: true
                }).then(sub => {
                    console.log('Endpoint URL: ', sub.endpoint);
                }).catch(err => {
                    if (Notification.permission === 'denied') {
                        console.warn('Permission for notifications was denied');
                    } else {
                        console.error('Unable to subscribe to push', err);
                    }
                });
            })
        }
    }

}

export default CustomNotification;