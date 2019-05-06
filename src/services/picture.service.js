const fs = require('fs');
const path = require('path');
const Picture = require('../models/picture');
const S3Service = require('../services/s3.service');

const getRemotePicture = Symbol('getRemotePicture');
const getLocalePicture = Symbol('getLocalePicture');
const getRandomItemFromArray = Symbol('getRandomItemFromArray');

const SUNSETS_FOLDER_URL = '/images/sunsets';
const SUNSETS_FOLDER_PATH = path.join(__dirname, '../../public', SUNSETS_FOLDER_URL);


class PictureService {

    constructor() {
        this.s3 = new S3Service();
    }

    getOnePicture(env) {
        if (env === "development") {
            return this[getLocalePicture]();
        } else {
            return this[getRemotePicture]();
        }
    };


    [getRemotePicture]() {
        return this.s3.listAllImgFromBucket()
            .then(pics => {
                const pic = new Picture();
                pic.url = this[getRandomItemFromArray](pics);
                return pic;
            })
    }

    [getLocalePicture]() {
        const picName = this[getRandomItemFromArray](fs.readdirSync(SUNSETS_FOLDER_PATH));
        return new Promise((resolve, reject) => {
            try {
                const pic = new Picture();
                pic.url = path.join(SUNSETS_FOLDER_URL, picName);
                resolve(pic);
            } catch (err) {
                reject(err);
            }
        });
    }

    [getRandomItemFromArray](items) {
        return items[Math.floor(Math.random() * items.length)];
    }
}


module.exports = PictureService;