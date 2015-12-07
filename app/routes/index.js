var express = require('express');
var router = express.Router();
var passport = require('../auth/auth');
var UserModel = require('../models/User').UserModel;

router.get('/', passport.authenticate('bearer', {session: false}), function (req, res) {
    res.status(200).json({msg: "api is running", status: "ok"});
});
router.post('/login', passport.authenticate('local', {session: false}), function (req, res) {
    res.status(200).json({
        email:req.user.email,
        access_token:req.user.access_token,
        username:req.user.username
    })
});

router.post('/register', function (req, res) {
    var body = req.body;
    var username = body.username;
    var password = body.password;
    var email = body.email;
    var User = new UserModel({
        username: username,
        password: password,
        email: email,
        access_token: require('crypto').randomBytes(32).toString('hex')
    });
    UserModel.find({$or:[{username: username},{email: email}] },function (err, user) {
        if (err) {
            console.log(err);
        }
        else if (user.length == 0) {
            User.save(function (err, user) {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    res.status(201).json(user);
                }
            })
        } else if (user != 0) {
            res.status(409).json();
        }
    });

});
module.exports = router;