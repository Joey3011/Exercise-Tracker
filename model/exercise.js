const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
    "username": String,
    "description": String,
    "duration": Number,
    "date": Date
})

let exercise = mongoose.model('exerciseInfo', exerciseSchema)

module.exports = exercise