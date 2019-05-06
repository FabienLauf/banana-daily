const AbstractRoute = require('./abstract');
const CacheService = require('../services/cache.service');

class CacheRoute extends AbstractRoute {

    constructor() {
        super();

        this.handleRequest('get', '/cache', this.listAllActiveCaches.bind(this));
        this.handleRequest('get', '/cache/flush', this.flushAllActiveCaches.bind(this));
    }

    listAllActiveCaches(req, res, next) {
        res.json(CacheService.listAll());
    }

    flushAllActiveCaches(req, res, next) {
        CacheService.flush();
        res.send('All caches flushed!');
    }
}


module.exports = new CacheRoute().routes;