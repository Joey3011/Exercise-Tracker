const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    "username": String
})

let user = mongoose.model('userInfo', userSchema)

module.exports = user