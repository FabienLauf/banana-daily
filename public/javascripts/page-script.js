import CustomNotification from './custom-notification.js';

const getPictureModel = Symbol('getPictureModel');
const updatePicture = Symbol('updatePicture');
const getExif = Symbol('getExif');
const getLocation = Symbol('getLocation');
const updateLocation = Symbol('updateLocation');
const updateUI = Symbol('updateUI');

class PageScript {

    constructor() {
        this.notif = new CustomNotification();
        this.main = document.querySelector('main');
        this.loader = document.querySelector('.loader');
        this.btns = {
            refresh: document.getElementById('butRefresh'),
            notif: document.getElementById('butNotification')
        };

        this.btns.refresh.addEventListener('click', this[updateUI].bind(this));
        if('Notification' in window && navigator.serviceWorker) {
            this.btns.notif.addEventListener('click', this.notif.displayNotification);
            this.btns.notif.removeAttribute('hidden');
        }
        
        this[updateUI]();
    }

    [getPictureModel]() {
        return fetch('/picture')
            .then((response) => {
                return response.json();
            })
            .catch((err) => {
                console.error('Fetch Picture Error', err);
            });
    }

    [getExif](picJson) {
        return fetch('/exif', {
            method: 'POST',
            body: JSON.stringify(picJson),
            headers: {"Content-Type": "application/json"}
        }).then(response => {
            return response.json();
        }).catch((err) => {
            console.error('Fetch Exif Error', err);
        });
    }

    [getLocation](picJson) {
        if (picJson._lat && picJson._long) {
            return fetch('/location/' + picJson._lat + '/' + picJson._long)
                .then(function (response) {
                    return response.text().then(location => {
                        picJson._location = location;
                        return picJson;
                    });
                })
                .catch((err) => {
                    console.error('Fetch Location Error', err);
                });
        } else {
            return Promise.resolve(picJson);
        }
    }


    [updatePicture](picJson) {
        const oldPicture = document.getElementById('picture-container');
        const newPicture = oldPicture.cloneNode(true);

        this.loader.classList.remove('is-hidden');
        this.main.removeChild(oldPicture);
        newPicture.querySelector('img').setAttribute('src', picJson.url);
        newPicture.addEventListener('click', this[updateUI].bind(this));
        this.loader.classList.add('is-hidden');

        this.main.appendChild(newPicture);

        this[updateLocation](picJson);
    }

    [updateLocation](picJson) {
        const location = document.getElementById('picture-container').querySelector('#location');
        if (picJson._lat && picJson._long) {
            if (picJson._location && picJson._date) {
                location.textContent = picJson._date + ' - ' + picJson._location;
                location.removeAttribute('hidden');
            } else {
                location.setAttribute('hidden', true);
            }
        } else {
            location.setAttribute('hidden', true);
        }
    }

    [updateUI]() {
        this[getPictureModel]().then(this[getExif]).then(this[getLocation]).then(this[updatePicture].bind(this)).catch(err => console.error('updateUI error:', err));
    }

}

if( document.readyState !== 'loading' ) {
    new PageScript();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        new PageScript();
    });
}