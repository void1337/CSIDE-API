var User = require('../models/User')
const Error = require('../models/ApiError')
const auth = require('../auth/auth')
const assert = require('assert')
const moment = require('moment')

module.exports = {

    validateToken(request, response, next) {
        const token = request.header('x-access-token') || '';
        auth.decodeToken(token, (error, payload) => {
            if(error) {
                response.status(401).json({
                message: "Unauthorized",
                code: 401,
                datetime: moment().format()
            }).end()
            } else {
                request.user = payload.sub
                next()
            }
        })
    },

    UserLogin(req,res,next){
        try {
            const body = req.body

            assert(body.username !== '', 'username empty or undefined')
            assert(body.password !== '', 'passkey empty or undefined')

            User.findOne({ username: body.username, password: body.password })
                .then((user) => {
                    const token = auth.encodeToken(user.username, user._id);
                    res.status(200).json({
                        message: "Logon successfull.",
                        success: true,
                        token: token,
                        username: user.username
                    })
                })
                .catch(() => {
                    next(new Error('Invalid login credentials.', 422))
                })
        } catch (err) {
            const error = new Error(err, 500);
            next(error)
        }
    }
}