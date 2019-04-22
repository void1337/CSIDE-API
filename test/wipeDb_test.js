const mongoose = ('mongoose');
var Artist = require('../models/Author')
var User = require('../models/User')

function resetTestDB(){
    User.findOneAndDelete({ "username": "tester", "password": "leteste" })
        .then(() => {
            console.log('user test deleted')
        })
        .catch((err) => {
            console.log('No user found to delete')
        })

    Author.findOneAndDelete({ "name": "Frank Herbert"})
        .then(() => {
            console.log('DB has been reset for testing purposes')
        })
        .catch((err) => {
            console.log('No authors found to delete')
        })
}

module.exports = { resetTestDB }