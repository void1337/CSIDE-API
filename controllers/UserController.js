const moment = require('moment')
const User = require('../models/User')
const Error = require('../models/ApiError')
const auth = require('../auth/auth')

module.exports = {

    //ww veranderen
    editPassword(req,res,next){
        var token
        var decodedUserToken = auth.decodeToken(req.get('x-access-token'), (err, payload) => {
            if (err) {
                const error = new Error("Niet geautoriseerd (geen valid token)", 401)
                res.status(401).json(error)
            } else {
                token = payload
            }
        })
        const body = req.body

        if (body.newPassword != null || body.newPassword != undefined){
            User.findOneAndUpdate({"_id" : token.userId, "password": body.password},{ "password": body.newPassword})
                .then((newUser) => {
                    res.status(200).json({
                        "message": "The user's password has been successfully changed!",
                        "code": 200,
                        "user": newUser
                    })
                })
                .catch((err) => {
                    next(new Error('User identifier could not be found or the database was not able to edit the user.',401))
                })
        } else {
            User.findOneAndUpdate({"_id" : token.userId},{ "fullname": body.name, "country": body.country })
                .then((newUser) => {
                    res.status(200).json({
                        "message": "The user has been succesfully edited.",
                        "code": 200,
                        "user": newUser
                    })
                })
                .catch((err) => {
                    next(new Error('User identifier could not be found or the database was not able to edit the user.',401))
                })
        }
    },

    //Delete
    deleteUser(req, res, next){
        var decodedUserToken = auth.decodeToken(req.get('x-access-token'), (err, payload) => {
            if (err) {
                const error = new Error("Niet geautoriseerd (geen valid token)", 401)
                res.status(401).json(error)
            } else {
                token = payload
            }
        })

        const user = token.userId
        const password= req.body.password

        User.findOneAndDelete({ "_id": user, "password": password })
            .then((user) => {
                res.status(200).send({
                    "message": "User has been succesfully deleted.",
                    "code": 200
                })
            })
            .catch((err) => {
                next(new Error('User identifier could not be found.', 422 ))
            })
    },

    //Create
    createUser(req, res, next) {
        const userData = req.body
        User.create(userData)
            .then(user => {
                res.status(201).json({
                    "message": "User succesfully created.",
                    "code": 201,
                    "user": user
                })
            })
        .catch((err) => {
            next(new Error(err, 500))
        });
    },

    get(req, res, next) {
        const userId = req.query.id
        User.findById(userId).lean()
            .then((user) => {
                if (user !== null){
                    res.status(200).json(user)
                } else {
                    next(new Error('User not found, wrong identifier.', 422))
                }
            })
            .catch(() => {
                next(new Error('User not found, wrong identifier.', 422))
            })
    }
}