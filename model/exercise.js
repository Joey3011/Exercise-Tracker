const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date
    }
},
{
    versionKey: false
})

let exercise = mongoose.model('exerciseInfo', exerciseSchema)

module.exports = exercise