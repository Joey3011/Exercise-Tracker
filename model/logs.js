const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    "username": String,
    "count": Number,
    "log": Array
})

let logs = mongoose.model('logInfo', logSchema)

module.exports = logs