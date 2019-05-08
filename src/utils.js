
class Utils {
    static promisify(fn, ...params) {
        return new Promise((resolve, reject) => {
            try {
                fn(...params.concat([(err, ...args) => err ? reject(err) : resolve( args.length < 2 ? args[0] : args )]));
            } catch (err) {
                reject(err);
            }
        });
        
        
    }

    static getRandomItemFromArray(items) {
        return items[Math.floor(Math.random() * items.length)];
    }
}


module.exports = Utils;