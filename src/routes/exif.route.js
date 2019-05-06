const fs = require('fs');
const path = require('path');
const request = require('request').defaults({ encoding: null });
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

        CacheService.get(`getExifData_${pic.fileName}`, () => {
            return this[getExifData](pic.url).then(picExifData => {
                                            return this[mapExifDataToPicture](pic, picExifData)
                                                .then(pic => {
                                                    return pic;
                                                })
                                                .catch(err1 => {
                                                    console.error('mapExifDataToPicture error', err1);
                                                });
                                        })
                                        .catch(err2 => {
                                            console.error('getExifData error', err2);
                                        });
        }).then(pic => {
            res.json(pic);
        });
    };


    [mapExifDataToPicture](pic, picExifData) {
        return new Promise((resolve, reject) => {
            try {
                if (picExifData.tags && picExifData.tags.GPSDateStamp) {
                    const date = picExifData.tags.GPSDateStamp.split(":");
                    pic.date = date[2] + '/' + date[1] + '/' + date[0];
                }
                if (picExifData.tags && picExifData.tags.GPSLatitude) {
                    pic.lat = picExifData.tags.GPSLatitude;
                    pic.long = picExifData.tags.GPSLongitude;
                }
                resolve(pic);
            } catch (err) {
                reject(err);
            }
        });
    }

    [getExifData](picPath) {
        return new Promise((resolve, reject) => {
            try {
                if (picPath.startsWith('http')) {
                    request.get(picPath, function (err, res, buffer) {
                        const parser = ExifParser.create(buffer);
                        const result = parser.parse();
                        resolve(result);
                    });
                } else {
                    const buffer = fs.readFileSync(path.join(__dirname, '../../public', picPath));
                    const parser = ExifParser.create(buffer);
                    const result = parser.parse();
                    resolve(result);
                }
            } catch (err) {
                reject(err);
            }
        })
    }
}


module.exports = new ExifRoute().routes;
