const moment = require('moment')
var Book = require('../models/Book')
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

        const properties = req.body
        Book.create({author: properties.author, publisher: properties.publisher, name: properties.name, publishdate:properties.publishdate, description: properties.description, genre: properties.genre, language: properties.language, img: properties.img})
            .then(book => {
                res.status(201).json({
                    "message": "The book has been succesfully archieved",
                    "code": 201,
                    "book": book
                })
            })
        .catch((err) => {
            next(new Error(err, 500))
        });
    },

    edit(req, res, next){
        var decodedUserToken = auth.decodeToken(req.get('x-access-token'), (err, payload) => {
            if (err) {
                const error = new Error("Niet geautoriseerd (geen valid token)", 401)
                res.status(401).json(error)
            } else {
                token = payload
            }
        })

        const bookId = req.body.id
        const properties = req.body

        Book.findByIdAndUpdate({ _id: bookId }, properties)
            .then(() => Book.findById({ _id: bookId}))
            .then((book) => res.status(200).json({
                "message": "the book has been succesfully edited.",
                "code": 200,
                "book": book
            }))
            .catch(() => {
                next(new Error('booknot found, wrong identifier.', 422))
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

        const bookId = req.query.id

        Book.findOneAndDelete({ _id: bookId})
            .then(() => res.status(200).json({
                "message": "The book has been succesfully removed.",
                "code": 200,
                "bookId": bookId
            }))
            .catch(() => {
                next(new Error('Book not found, wrong ID.', 422))
            })
    },

    get(req, res, next) {
        if (req.query.id != undefined){
            const bookId = req.query.id
            Book.findById(bookId).lean()
                .then((book) => {
                    if (book !== null){
                        res.status(200).json(book)
                    } else {
                        next(new Error('Book not found, wrong ID', 422))
                    }
                })
                .catch(() => {
                    next(new Error('Book not found, wrong ID.', 422))
                })
        } else if (req.query.limit == 1){
            Book.findOne()
                .then((books) => {
                    res.status(200).json(books)
                })
                .catch(() => {
                    next(new Error('No books have been added yet', 404))
                })
        } else if (req.query.limit == 10){
            Book.find({}).limit(10)
                .then((books) => {
                    res.status(200).json(books)
                })
                .catch(() => {
                    next(new Error('No books have been added yet', 404))
                })
        } else {
            Book.find({})
                .then((books) => {
                    res.status(200).json(books)
                })
                .catch(() => {
                    next(new Error('No books have been added yet', 404))
                })
        }
    }
}