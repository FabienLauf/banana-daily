const fs = require('fs');
const path = require('path');
const request = require('request').defaults({ encoding: null });
const Utils = require('../utils');
const AbstractRoute = require('./abstract');
const Picture = require('../models/picture');
const ExifParser = require('exif-parser');
const CacheService = require('../services/cache.service');

const mapExifDataToPicture = Symbol('mapExifDataToPicture');
const getExifData = Symbol('getExifData');


class ExifRoute extends AbstractRoute {

    constructor() {
        super();
        this.handleRequest('post', '/exif', this.getExifData.bind(this));
    }


    getExifData(req, res, next) {
        const body = req.body;
        const pic = Object.assign(new Picture(), body);

        try {
            CacheService.get(`getExifData_${pic.fileName}`, () => {
                return this[getExifData](pic.url).then((picExifData) => this[mapExifDataToPicture](pic, picExifData));
            }).then(fullPic => {
                res.json(fullPic);
            }).catch((err) => {
                console.error('getExifData error', err);
            });
        } catch (err) {
            console.error('getExifData error', err);
        }
    };


    [mapExifDataToPicture](pic, picExifData) {
        if (picExifData.tags && picExifData.tags.GPSDateStamp) {
            const date = picExifData.tags.GPSDateStamp.split(":");
            pic.date = date[2] + '/' + date[1] + '/' + date[0];
        }
        if (picExifData.tags && picExifData.tags.GPSLatitude) {
            pic.lat = picExifData.tags.GPSLatitude;
            pic.long = picExifData.tags.GPSLongitude;
        }
        return pic;
    }

    [getExifData](picPath) {
        if (picPath.startsWith('http')) {
            return Utils.promisify(request.get, picPath).then((result) => {
                const buffer = result[1];
                return ExifParser.create(buffer).parse();
            });
        } else {
            return Utils.promisify(fs.readFile, path.join(__dirname, '../../public', picPath)).then((buffer) => {
                return ExifParser.create(buffer).parse();
            });
        }
    }
}


module.exports = new ExifRoute().routes;
