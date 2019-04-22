const moment = require('moment')
var Publisher = require('../models/Publisher')
const Error = require('../models/ApiError')
const auth = require('../auth/auth')

module.exports = {
    create(req, res, next){
        var decodedUserToken = auth.decodeToken(req.get('x-access-token'), (err, payload) => {
            if (err) {
                const error = new Error("Niet geautoriseerd (geen valid token)", 401)
                res.status(401).json(error)
            } else {
                token = payload
            }
        })

        const prop = req.body
        Publisher.create(prop)
            .then(publisher => {
                res.status(201).json({
                    "message": "publisher has been succesfully created.",
                    "code": 201,
                    "publisher": publisher
                })
            })
        .catch((err) => {
            next(new Error(err, 500))
        });
    },

    edit(req, res, next){
        var decodedUserToken = auth.decodeToken(req.get('x-access-token'), (err, payload) => {
            if (err) {
                const error = new Error("Unauthorized", 401)
                res.status(401).json(error)
            } else {
                token = payload
            }
        })

        const publisherId = req.body.id
        const properties = req.body

        Publisher.findByIdAndUpdate({ _id: publisherId }, properties)
            .then(() => Publisher.findById({ _id: publisherId}))
            .then((publisher) => res.status(200).json({
                "message": "Publisher has been succesfully edited.",
                "code": 200,
                "publisher": publisher
            }))
            .catch(() => {
                next(new Error('publisher not found, wrong identifier.', 422))
            })
    },

    delete(req, res, next) {
        var decodedUserToken = auth.decodeToken(req.get('x-access-token'), (err, payload) => {
            if (err) {
                const error = new Error("Niet geautoriseerd (geen valid token)", 401)
                res.status(401).json(error)
            } else {
                token = payload
            }
        })

        const publisherId = req.query.id

        Publisher.findOneAndDelete({ _id: publisherId})
            .then(() => res.status(200).json({
                "message": "publisher has been succesfully deleted.",
                "code": 200,
                "publisherId": publisherId
            }))
            .catch((err) => {
                next(new Error(err, 422))
            })
    },

    get(req, res, next) {
        if (req.query.id != undefined){
            const publisherId = req.query.id
            Publisher.findById(publisherId)
                .then((publisher) => {
                    if (publisher !== null){
                        res.status(200).json(publisher)
                    } else {
                        next(new Error('publisher not found, wrong ID.', 422))
                    }
                })
                .catch(() => {
                    next(new Error('publisher not found, wrong ID.', 422))
                })
        } else {
            Publisher.find({})
                .then((publishers) => {
                    res.status(200).json(publishers)
                })
                .catch(() => {
                    next(new Error('publishers not found.', 404))
                })
        }
    }
}