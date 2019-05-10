const path = require('path');

class Picture {

    constructor(url) {
        this.url = url;
        this.fileName = path.basename(url);
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
