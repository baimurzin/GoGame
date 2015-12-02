var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    access_token : {
        type: String,
        unique: true
    }
});

UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.hashed_password;
    return obj;
};

UserSchema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1','' /*, this.salt*/).update(password).digest('hex');
    //more secure – return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

UserSchema.virtual('userId')
    .get(function () {
        return this._id;
    });

UserSchema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        //this.salt = crypto.randomBytes(32).toString('hex');
        //more secure - this.salt = crypto.randomBytes(128).toString('hex');
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

UserSchema.methods.verifyPassword = function (password) {
    return this.encryptPassword(password) === this.hashed_password;
};

var ClientSchema = new Schema({

    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
});

var AccessTokenSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// RefreshToken
var RefreshTokenSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});
/*
 *    DB objects:
 *
 *    User – a user who has a name, password hash and a salt.
 *    Client – a client application which requests access on behalf of a user, has a name and a secret code.
 *    AccessToken – token (type of bearer), issued to the client application, limited by time.
 *    RefreshToken – another type of token allows you to request a new bearer-token without re-request a password from the user.
 */

var UserModel = mongoose.model('User', UserSchema);
var ClientModel = mongoose.model('Client', ClientSchema);
var AccessTokenModel = mongoose.model('AccessToken', AccessTokenSchema);
var RefreshTokenModel = mongoose.model('RefreshToken', RefreshTokenSchema);


module.exports = {
    UserModel: UserModel,
    ClientModel: ClientModel,
    AccessTokenModel: AccessTokenModel,
    RefreshTokenModel: RefreshTokenModel
};