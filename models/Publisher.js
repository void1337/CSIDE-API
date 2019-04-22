const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PublisherSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name of the publisher is required'],
        unique: true
    },
    country: {
        type: String,
        required: [true, 'country of the publisher is required']
    },
    city: {
        type: String,
        required: [true, 'the city of the publisher is required']
    },
    address: {
        type: String,
        required: [true, 'the address of the publisher is required']
    },
    email: {
        type: String,
        required: [true, 'the email of the publisher is required']
    },
    phone: {
        type: String,
        required: [true, 'the phone number of the publisher is required']
    }
})





module.exports = mongoose.model('publisher', PublisherSchema)