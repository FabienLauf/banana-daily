const Utils = require('../utils');
const CacheService = require('../services/cache.service');
const AWS = require('aws-sdk');

const BUCKET_ID = "banana-daily";
const S3_URL = 'https://s3-ap-southeast-1.amazonaws.com/banana-daily/';


class S3Service {

    constructor() {
        this.s3 = new AWS.S3(require('../configs/aws.json'));
    }


    listAllImgFromBucket() {
        return CacheService.get(`listObjectsV2_${BUCKET_ID}`, () => {
            var params = {
                Bucket: BUCKET_ID
            };
            return Utils.promisify(this.s3.listObjectsV2.bind(this.s3), params)
                .then((data) => {
                    const pics = [];
                    if (data && data.Contents && data.Contents.length > 0) {
                        data.Contents.forEach(pic => {
                            if (pic.Key.endsWith('.jpg')) {
                                pics.push(S3_URL + pic.Key);
                            }
                        });
                    }
                    return pics;
                }).catch((err) => {
                    console.error('listObjectsV2 error', err);
                });
        }).then(pics => {
            return pics;
        });
    };
}


module.exports = S3Service;