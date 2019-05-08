const AbstractRoute = require('./abstract');
const NodeGeocoder = require('node-geocoder');
const CacheService = require('../services/cache.service');


class LocationRoute extends AbstractRoute {

    constructor() {
        super();
        this.geocoder = NodeGeocoder({
            provider: 'openstreetmap',
            // Optional depending on the providers
            httpAdapter: 'https',
            formatter: 'string',
            formatterPattern: '%c, %T, %P',
            language: 'en-US',
            zoom: 10
        });

        this.handleRequest('get', '/location/:lat/:long', this.getLocation.bind(this));
    }

    getLocation(req, res, next) {
        const lat = req.params.lat;
        const long = req.params.long;

        var location = '';
        if (lat && long) {
            CacheService.get(`getLocation_${lat}_${long}`, () => {
                return this.geocoder
                    .reverse({lat: lat, lon: long})
                    .then((geoResp) => {
                        if (geoResp && geoResp.length > 0) {
                            location = geoResp[0].split("undefined, ").join("");
                        }
                        return location;
                    })
                    .catch(function (err) {
                        console.error('geocoder reverse error', err);
                        return location;
                    });
            }).then(loc => {
                res.send(loc);
            });
        } else {
            res.send(location);
        }
    }
}


module.exports = new LocationRoute().routes;