
const messages = ['I love you Banane! ❤️', 'Hello Banane!', 'kolo meeeee!', 'Eh! I see you ah!', 'You say me?', 'I say you lah!',
    'Plop plop plop', 'I love you like monkeys love bananas', 'Eh, ask me ask me!', 'Do you love me?', 'Arigato 🙇‍♂️'];

class CustomNotification {

    constructor() {
        if ('Notification' in window && navigator.serviceWorker) {
            Notification.requestPermission(status => {
                console.log('Notification permission status:', status);
                if (Notification.permission == 'granted') {
                    this.subscribeUser();
                }
            });
        }
    }

    displayNotification() {
        if (Notification.permission == 'granted') {
            navigator.serviceWorker.getRegistration().then(reg => {
                const options = {
                    badge: '/images/icons/icon-96x96.png',
                    icon: '/images/icons/icon-144x144.png',
                    vibrate: [100, 50, 100],
                    dir: 'auto',
                    lang: 'en-US'
                };

                const message = messages[Math.floor(Math.random() * messages.length)];
                reg.showNotification(message, options);
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