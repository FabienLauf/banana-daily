const getPictureModel = Symbol('getPictureModel');
const updatePicture = Symbol('updatePicture');
const updateExif = Symbol('updateExif');
const getLocation = Symbol('getLocation');
const updateLocation = Symbol('updateLocation');
const updateUI = Symbol('updateUI');

class PageScript {

    constructor() {
        this.main = document.querySelector('main');
        this.loader = document.querySelector('.loader');
        document.getElementById('butRefresh').addEventListener('click', this[updateUI].bind(this));
        this[updateUI]();
    }

    [getPictureModel]() {
        return fetch('/picture')
            .then(function (response) {
                return response.json();
            })
            .catch(function (err) {
                console.error('Fetch Picture Error', err);
            });
    }

    [updatePicture]() {
        const oldPicture = document.getElementById('picture-container');
        const newPicture = oldPicture.cloneNode(true);

        this.loader.classList.remove('is-hidden');
        this.main.removeChild(oldPicture);

        return this[getPictureModel]()
            .then(picJson => {
                newPicture.querySelector('img').setAttribute('src', picJson._url);
                newPicture.addEventListener('click', this[updateUI].bind(this));
                this.loader.classList.add('is-hidden');
                this.main.appendChild(newPicture);
                return picJson;
            });
    }


    [updateExif](picJson) {
        return fetch('/exif', {
            method: 'POST',
            body: JSON.stringify(picJson),
            headers: {"Content-Type": "application/json"}
        }).then(response => {
            return response.json();
        }).catch(function (err) {
            console.error('Fetch Exif Error', err);
        });
    }

    [getLocation](lat, long) {
        return fetch('/location/' + lat + '/' + long)
            .then(function (response) {
                return response.text();
            })
            .catch(function (err) {
                console.error('Fetch Location Error', err);
            });
    }

    [updateLocation](picJson) {
        const location = document.getElementById('picture-container').querySelector('#location');
        if (picJson._lat && picJson._long) {
            return this[getLocation](picJson._lat, picJson._long)
                .then(locationTxt => {
                    picJson._location = locationTxt;
                    if (picJson._location) {
                        location.textContent = picJson._date + ' - ' + picJson._location;
                        location.removeAttribute('hidden');
                    } else {
                        location.setAttribute('hidden', true);
                    }
                });
        } else {
            location.setAttribute('hidden', true);
        }
    }

    [updateUI]() {
        this[updatePicture]().then(urlJson => {
            this[updateExif](urlJson).then(exifJson => {
                this[updateLocation](exifJson);
            });
        });
    }

}

if( document.readyState !== 'loading' ) {
    new PageScript();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        new PageScript();
    });
}