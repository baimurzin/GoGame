/**
 * Created by vbaimurzin on 03.11.2015.
 */

var express = require('express');
var path = require('path');
var config = require('../config/config');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var passport = require('../auth/auth');
var methodOverride = require('method-override');
require('mongoose').connect(config.get('mongoose:uri'), function (err) {
    if (err)
        console.error(err);
});
var app = express();
app.use(passport.initialize());
app.use(methodOverride());
app.use(busboy());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// swagger.setAppHandler(app);

module.exports = app;