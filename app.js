require('dotenv').config()

const express = require('express')
const app = express()

const ejs = require('ejs')
const path = require('path')

const session = require('express-session')
const cookies = require('cookie-parser')
const flash = require('connect-flash')

const DbConnect = require('./app/config/dbConnect')
DbConnect()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(cookies())
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}))

app.use(flash())
// Make flash messages available to all templates
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg'),
        res.locals.error_msg = req.flash('error_msg'),
        res.locals.info_msg = req.flash('info_msg'),
        next()
})

// 404 Error Handler
// app.use((req, res, next) => {
// res.status(404).render('404', {
//     title: "Page not found",
//     message: "The page you are looking for does not exist",
//     error: {
//         status: 404,
//         stack: ''
//     }
// })
// })

// Global Error Handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
// res.status(err.status || 500).render('404', {
//     title: 'Error',
//     message: 'Something went wrong!',
//     error: {
//         status: err.status || 500,
//         stack: process.env.NODE_ENV === 'production' ? '' : err.stack
//     }
// });
// }); 

const userRouter = require('./app/router/userRouter')
app.use(userRouter)

const categoryRouter = require('./app/router/productRouter')
app.use(categoryRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server running http://localhost:${process.env.PORT}`);

})