const path = require('path');

class Picture {

    get url() {
        return this._url;
    }
    set url(url) {
        this._url = url;
        this._fileName = path.basename(url);
    }

    get fileName() {
        return this._fileName;
    }
    set fileName(fileName) {
        this._fileName = fileName;
    }

    get lat() {
        return this._lat;
    }
    set lat(lat) {
        this._lat = lat;
    }

    get long() {
        return this._long;
    }
    set long(long) {
        this._long = long;
    }

    get location() {
        return this._location;
    }
    set location(location) {
        this._location = location;
    }

    get date() {
        return this._date;
    }
    set date(newDate) {
        this._date = newDate;
    }
}

module.exports = Picture;
