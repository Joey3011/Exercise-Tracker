
require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const userInfo = require('./model/user')
const exerciseInfo = require('./model/exercise')
let bodyParser = require('body-parser')
const PORT = process.env.PORT || 3500

connectDB()

app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: "false" }));

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

//username | user info
app.post('/api/users', (req, res) => {
    let userQuery = { "username": req.body.username}
    userInfo.find((userQuery), (err, userData) => {
        if(err){
          console.log("Error: ", err)
        } else {
            if(userData.length === 0){
                const newUser = new userInfo({
                    "_id": req.body.id,
                    "username": req.body.username
                })
                newUser.save((err, data) => {
                    if(err){
                        console.log(err)
                    } else{
                        console.log("User info save successfuly")
                        res.json({
                            "_id": data.id,
                            "username": data.username
                        })
                    } 
                })
            }else{
                res.send("Username already exist")
            }
        }
    })
})

app.post('/api/users/:_id/exercises', (req, res) => {
    let inputID = { "id": req.params._id }
    let checkDate = new Date(req.body.date)
    let idToCHeck = inputID.id


    let dateHandler = () => {
        if(checkDate instanceof Date && !isNaN(checkDate)){
            return checkDate
        } else {
            checkDate = new Date()
        }
    }
    userInfo.findById(idToCHeck, (err, data) => {
        dateHandler(checkDate)
        if(err){
            console.log("error: ", err)
        }else{
            
            const exerciseInput = new exerciseInfo({
                "username": data.username,
                "description": req.body.description,
                "duration": req.body.duration,
                "date": checkDate.toDateString()
            })

            exerciseInput.save((err, data) => {
                if(err){
                    console.log(err)
                }else{
                    console.log("exercise info save successfuly")
                    res.json({
                        "_id": idToCHeck,
                        "username": data.username,
                        "description": data.description,
                        "duration": data.duration,
                        "date": data.date.toDateString()
                    })
                }
            })
        }
    })
}) 

app.get('/api/users/:_id/logs?', (req, res) =>{
    const {from, to, limit } = req.query
    let inputID = { "id": req.params._id }
    let idToCHeck = inputID.id

    userInfo.findById(idToCHeck, (err, data) => {
        if(err){
            console.log(err)
        }else{
            var queryUsername = ({
                username: data.username
            })

            if(from !== undefined && to === undefined){
                queryUsername.date = { $gte: new Date(from)}
            }else if(to !== undefined && from === undefined){
                queryUsername.date = {$lte: new Date(to)}
            }else if (from !== undefined && to !== undefined){
                queryUsername.date = {$gte: new Date(from), $lte: new Date(to)}
            }

            let limitChecker = (limit) => {
                let maxLimit = 100
                if(limit){
                    return limit
                }else{
                    return maxLimit
                }
            }

            exerciseInfo.find(queryUsername, null, {limit: limitChecker(+limit)}, (err, users) => {
                 let loggedArray = []

                if(err){
                    console.log(err)
                }else{
                    
                    loggedArray =  users.map((item) => {
                        return {
                            "description": item.description,
                            "duration": item.duration,
                            "date": item.date.toDateString()
                        }
                    })

                    res.json({
                        "username": data.username, 
                        "count" : loggedArray.length,
                        "_id": idToCHeck,
                        "log": loggedArray
                    })
                }
            })
        }
    })
})

app.get('/api/users', (req, res) =>{
    userInfo.find({}, (err, data) => {
        if(err){
            res.send("No record found...")
        }else {
            res.json(data)
        }
    })
})

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
})
