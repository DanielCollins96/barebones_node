const express = require('express');
const path = require('path');
require('dotenv').config();
const logger = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const mongoose = require('mongoose');
// const passport = require('passport');
// require('./config/passport')(passport);
const helmet = require('helmet')
// const next = require('next')


//Mongoose Schemas
User = require('./models/user');
Post = require('./models/post');


let app = express();

// app.use(express.static(path.join(__dirname, 'public')))

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected')
});
db.on('error', (err) => {
    console.log('error: ' + err)
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoDBStore({mongooseConnection: mongoose.connection, ttl: 3600}),
    cookie: {maxAge: 1800000}
    // cookie: {maxAge: 120000}
}));

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(flash());

app.use(logger('dev'));

// app.use((req, res, next) => {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     next();
// });

// app.use((req, res, next) => {
//     if (!req.session.user) {
//         return next();
//     }
//     console.log(req.session.user.name)
//     res.locals.username = req.session.user.name;
//     next()
// });

app.use('/', require('./routes/home.js'));


app.post('/profile/create-post', (req, res) => {
    console.log(req.user._id)
    let {title, comment} = req.body;
    let name = req.user._id;
    let newPost = new Post({
        title,
        comment,
        author: name
    })
    newPost.save((err, doc) => {
        if (err) {
            req.flash('error_msg', 'Error attempting to post');
            res.redirect('/profilessss');
        } else {
            req.flash('success_msg', 'Successfully Posted');
            res.redirect('/profile');
        }
    })
    })

app.listen(5000, () => {
    console.log('Express Listening')
});