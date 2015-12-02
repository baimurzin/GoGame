/**
 * Created by vlad on 01.12.2015.
 */
var config = require('../config/config');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var UserModel = require('../models/User').UserModel;
var ClientModel = require('../models/User').ClientModel;
var AccessTokenModel = require('../models/User').AccessTokenModel;
var RefreshTokenModel = require('../models/User').RefreshTokenModel;
//TODO переписать все нахрен, здесь нормальное разбитие на модели.
passport.use(new LocalStrategy(function (username, password, cb) {
    UserModel.findOne({username: username}, function (err, client) {

        if (client.verifyPassword(password)) {
            // если пароль верен - пользователь авторизовывается, ему создается токен
            // и отдается дальше
            require('crypto').randomBytes(32, function (ex, buf) {
                var token = buf.toString('hex');
                client.access_token = token;
                client.save(function (err, client) {
                    if (err) {
                        return cb(err);
                    }
                    if (!client) {
                        return cb(null, false);
                    }
                    console.log(client);
                    return cb(null, client);
                })
            });

        } else {
            return cb(null, false);
        }
        if (err) {
            return cb(err);
        }
        if (!client) {
            return cb(null, false);
        }
    })
}));

passport.use(new BearerStrategy(function (accessToken, done) {
    console.log("BEARER");
    UserModel.findOne({access_token: accessToken}, function (err, token) {
        if (err) {
            return done(err);
        }
        if (!token) {
            return done(null, false);
        }
        //if (Math.round((Date.now() - token.created)) / 1000 > config.get('security:tokenLife')) {
        //    AccessTokenModel.remove({token: accessToken}, function (err) {
        //        if (err) return done(err);
        //    });
        //    return done(null, false, {message: 'Token expired'});
        //}
        var info = {scope: '*'};
        done(null, token, info);

        //UserModel.findById(token.userId, function (err, user) {
        //    if (err) {
        //        return done(err);
        //    }
        //    if (!user) {
        //        return done(null, false, {message: 'Unknown user'})
        //    }
        //    var info = {scope: '*'};
        //    done(null, user, info);
        //})
    })
}));

module.exports = passport;