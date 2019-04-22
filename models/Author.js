const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuthorSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name of author is required'],
        unique: true
    },
    country: {
        type: String,
        required: [true, 'country of author is required']
    },
    bio: {
        type: String,
        required: [true, 'bio of author is required']
    },
    birthyear: {
        type: String,
        required: [true, 'birthyear of author is required']
    },
    img: {
        type: String,
        required: [false, 'image of author is required']
    }
})


AuthorSchema
    .pre('findOneAndDelete', function(next){
        const Book = mongoose.model('book')
        Book.deleteMany({ author: this._conditions._id })
        .then( () => next() )
    })


module.exports = mongoose.model('author', AuthorSchema)