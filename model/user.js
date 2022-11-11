const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    "username": {
       type: String,
       unique: true,
    },
},
{
    versionKey: false
})

let user = mongoose.model('userInfo', userSchema)

module.exports = user