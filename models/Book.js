const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'author',
        required: true 
    },
    publisher: {
        type: Schema.Types.ObjectId, 
        ref: 'publisher',
        required: true 
    },
    name: {
        type: String,
        required: [true, 'name of book is required'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'description of book is required']
    },
    genre: {
        type: String,
        required: [true, 'genre of book is required']
    },
    language: {
        type: String,
        required: [true, 'language of book is required']
    },
    publishdate: {
        type: String,
        required: [true, 'publishdate of book is required']
    },
    img: {
        type: String,
        required: [true, 'image of book is required']
    }
})




function autoPopulateAuthors(next) {
    this.populate('author')
    next()
}

function autoPopulatePublishers(next) {
    this.populate('publisher')
    next()
}

BookSchema
    .pre('findOne', autoPopulateAuthors)
    .pre('find', autoPopulateAuthors)
    .pre('findById', autoPopulateAuthors)
    .pre('findOne', autoPopulatePublishers)
    .pre('find', autoPopulatePublishers)
    .pre('findById', autoPopulatePublishers)
    


module.exports = mongoose.model('book', BookSchema)