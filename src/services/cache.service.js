const NodeCache = require('node-cache');

const ttlSeconds = 60 * 60 * 24 * 7; // cache for 1 week;
const _cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });

class CacheService {

    static listAll() {
        return _cache.data;
    }

    static get(key, storeFunction) {
        const value = _cache.get(key);
        if (value) {
            return Promise.resolve(value);
        }

        return storeFunction().then((result) => {
            _cache.set(key, result);
            return result;
        });
    }

    static del(keys) {
        _cache.del(keys);
    }

    static delStartWith(startStr = '') {
        if (!startStr) {
            return;
        }

        const keys = _cache.keys();
        for (const key of keys) {
            if (key.indexOf(startStr) === 0) {
                this.del(key);
            }
        }
    }

    static flush() {
        _cache.flushAll();
    }
}


module.exports = CacheService;
