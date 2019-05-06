class AbstractRoute {

    constructor() {
        this._routes = [];
    }

    handleRequest(method, uri, handler) {
        this._routes.push({
            method: method,
            uri: uri,
            handler: handler
        });
    }

    get routes() {
        return this._routes;
    }
}


module.exports = AbstractRoute;