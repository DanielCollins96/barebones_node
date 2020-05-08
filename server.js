const express = require('express');
const path = require('path');
require('dotenv').config();
const morgan = require('morgan');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const mongoose = require('mongoose');

//Mongoose User Schema
let User = require('./models/user');


let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected')
})
db.on('error', (err) => {
    console.log('error' + err)
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('index', {Authenticated: req.session.Authenticated})   
});

app.get('/login', (req, res) => {
    res.render('login', {Authenticated: req.session.Authenticated})
})

app.post('/login', async (req, res) => {
    let {email, password} = req.body;
    User.findOne({
        email: email
    }).then(async (user) => {
        if(!user) {
            req.flash('error_msg', 'Email not registered');
            return res.redirect('/login');
        }
        let match = await bcrypt.compare(password, user.password);
        if (match) {
            console.log('logged in')
            req.session.Authenticated = true;
            req.session.user = email;
            return res.redirect('/profile');
        }
        req.flash('error_msg', 'Username or Password incorrect');
        res.redirect('/login')
        // res.render('login', {Authenticated: req.session.Authenticated})
    }) 
    })    


app.get('/register', (req, res) => {
    res.render('register', {Authenticated: req.Authenticated})
})

app.post('/register', async (req, res) => {
    let {username, email, password} = req.body;
    console.log(email)
    let user = await User.findOne({ email: email });
    if (user) {
        req.flash('error_msg', 'User with this email already exists');
        return res.redirect('/register')
    }  
    let hashedPassword = await bcrypt.hash(password, 10);
    let newUser = new User({
        name: username,
        email,
        password: hashedPassword
    })
    newUser.save()
    .then(u => {
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('login');
        // res.render('login', {Authenticated: req.session.Authenticated};
    })
})

app.get('/profile', (req, res) => {
    if (req.session.Authenticated) {
        return res.render('profile', {Authenticated: req.session.Authenticated})
    }
    req.flash('error_msg', 'Login to see your profile')
    res.redirect('/login')
})

app.get('/logout', (req, res) => {
    // req.flash('success_msg', 'logging out');
    req.session.destroy();
    res.redirect('/');
})

app.listen(3000, () => {
    console.log('Listening')
})