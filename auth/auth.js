//login met jwt token
const config = require('./config');
const moment = require('moment');
const jwt = require('jwt-simple');

//usernametotoken
function encodeToken(username, id, rank) {
    const payload = {
        exp: moment().add(99999, 'minutes').unix(), //expiry
        iat: moment().unix(),
        "username": username,
        "userId": id
    };

    //coderen met private key
    return jwt.encode(payload, config.PrivateKey);
}

//token decoderen
function decodeToken(token, callback) {
    try {
        const payload = jwt.decode(token, config.PrivateKey);
        // expired?
        const now = moment().unix();
        if(now > payload.exp) {
            callback('Token has expired', null);
        } else {
            callback(null, payload);
        }
    } catch(error) {
        callback(error, null);
    }
}

module.exports = { encodeToken, decodeToken };