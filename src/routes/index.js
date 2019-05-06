const fs = require('fs');
const router = require('express').Router();

fs.readdir(__dirname, (err, list) => {
    list.filter(item => item.endsWith('.route.js'))
        .forEach(routeFile => {
            const route = require('./'+routeFile);
            route.forEach(subRte => router[subRte.method](subRte.uri, subRte.handler));
        });
});

module.exports = router;