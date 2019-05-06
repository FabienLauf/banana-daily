const AbstractRoute = require('./abstract');
const PictureService = require('../services/picture.service');

class PictureRoute extends AbstractRoute {

    constructor() {
        super();
        this.pictureService = new PictureService();

        this.handleRequest('get', '/picture', this.getPictureData.bind(this));
    }

    getPictureData(req, res, next) {
        this.pictureService.getOnePicture(req.app.get('env'))
            .then(pic => {
                res.json(pic);
            }).catch(err => {
                console.error('getPictureData error', err);
            });
    }

}


module.exports = new PictureRoute().routes;