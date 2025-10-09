require('dotenv').config()

const express = require('express')
const app = express()

const ejs = require('ejs')
const path = require('path')

const session = require('express-session')
const cookies = require('cookie-parser')
const cors = require('cors')
const flash = require('connect-flash')

// const mongoose = require('mongoose')
// const MongoStore = require('connect-mongo')
const DbConnect = require('./app/config/dbConnect')
DbConnect()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Show error message (No Internet Connection) 
// ✅ Optional Middleware to Block Requests if No Internet
// app.use((req, res, next) => {
//     if (mongoose.connection.readyState !== 1) {
//         return res.send('<h3 style="color:red;">❌ Please check your internet connection.</h3>');
//     }
//     next();
// });

// Call the cookies
app.use(cookies())

// Call the Session
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    // store: MongoStore.create({
    //     mongoUrl: process.env.MONGODB_CONNECT_URL
    // }),
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

app.use(cors())
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://node-e-commerce-products.vercel.app/',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true  // important if using session/cookies
}));

// 404 Error Handler
// app.use((req, res, next) => {
// res.status(404).render('404', {
//     title: "Page not found",
//     message: "The page you are looking for does not exist",
//     error: {
//         status: 404,
//         stack: null
//     }
// })
// // next()
// })

// Global Error Handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(err.status || 500).render('404', {
//         title: 'Error',
//         message: 'Something went wrong!',
//         error: {
//             status: err.status || 500,
//             stack: process.env.NODE_ENV === 'production' ? '' : err.stack
//         }
//     });
// });

// Global middleware for common meta data
app.use((req, res, next) => {
    res.locals.siteName = 'Premium Shop';
    res.locals.siteUrl = 'https://node-e-commerce-products.vercel.app';
    res.locals.defaultDescription = 'Discover amazing products at unbeatable prices. Quality meets affordability in every purchase.';
    res.locals.defaultImage = 'https://node-e-commerce-products.vercel.app/image/image.png'; // ✅ FULL URL
    res.locals.twitterHandle = '@premiumshop';
    next();
});

// ✅ 1. Import middleware
const { attachUser } = require('./app/middleware/checkValidateUser');

// ✅ 2. Use BEFORE your routes
app.use(attachUser);

const userRouter = require('./app/router/userRouter')
app.use(userRouter)

const categoryRouter = require('./app/router/productRouter')
app.use(categoryRouter)


app.listen(process.env.PORT, () => {
    console.log(`Server running http://localhost:${process.env.PORT}`);

})
