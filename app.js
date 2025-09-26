require('dotenv').config()

const express = require('express')
const app = express()
const ejs=require('ejs')
const path=require('path')

const DbConnect = require('./app/config/dbConnect')
DbConnect()

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const userRouter = require('./app/router/userRouter')
app.use(userRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server running http://localhost:${process.env.PORT}`);

})