const moment = require('moment')
var Author = require('../models/Author')
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
        Author.create(prop)
            .then(author => {
                res.status(201).json({
                    "message": "Author has been succesfully created.",
                    "code": 201,
                    "author": author
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

        const authorId = req.body.id
        const properties = req.body

        Author.findByIdAndUpdate({ _id: authorId }, properties)
            .then(() => Author.findById({ _id: authorId}))
            .then((author) => res.status(200).json({
                "message": "Author has been succesfully edited.",
                "code": 200,
                "author": author
            }))
            .catch(() => {
                next(new Error('author not found, wrong identifier.', 422))
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

        const authorId = req.query.id

        Author.findOneAndDelete({ _id: authorId})
            .then(() => res.status(200).json({
                "message": "Author has been succesfully deleted.",
                "code": 200,
                "authorId": authorId
            }))
            .catch((err) => {
                next(new Error(err, 422))
            })
    },

    get(req, res, next) {
        if (req.query.id != undefined){
            const authorId = req.query.id
            Author.findById(authorId)
                .then((author) => {
                    if (author !== null){
                        res.status(200).json(author)
                    } else {
                        next(new Error('Author not found, wrong ID.', 422))
                    }
                })
                .catch(() => {
                    next(new Error('Author not found, wrong ID.', 422))
                })
        } else {
            Author.find({})
                .then((authors) => {
                    res.status(200).json(authors)
                })
                .catch(() => {
                    next(new Error('Authors not found.', 404))
                })
        }
    }
}