var nconf = require('nconf');

nconf.argv()
    .env()
    .file({
        file: process.cwd() + '/app/config/config.json'
    });

module.exports = nconf;