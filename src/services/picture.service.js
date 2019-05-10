const fs = require('fs');
const path = require('path');
const Utils = require('../utils');
const Picture = require('../models/picture');
const S3Service = require('../services/s3.service');

const getRemotePicture = Symbol('getRemotePicture');
const getLocalePicture = Symbol('getLocalePicture');

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
            .then(pics => new Picture(Utils.getRandomItemFromArray(pics)));
    }

    [getLocalePicture]() {
        return Utils.promisify(fs.readdir, SUNSETS_FOLDER_PATH, {withFileTypes:true})
            .then((files) => {
                return files.filter((file) => {
                    return file.isFile() && file.name.endsWith('.jpg');
                });
            }).then((files) => {
                return Utils.getRandomItemFromArray(files);
            }).then((file) => {
                return new Picture(path.join(SUNSETS_FOLDER_URL, file.name));
            }).catch((err) => {
                console.error('getLocalePicture error:', err);
            });
    }

}


module.exports = PictureService;