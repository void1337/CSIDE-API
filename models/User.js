const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'An unique username is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'A Password is required']
    },
    name: {
        type: String,
        required: [true, 'A name is required']
    },
    country: {
        type: String,
        required: [true, 'A Country is required']
    }
})

module.exports = mongoose.model('user', UserSchema)