const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

let app = express();

var users = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(flash());

app.use((req, res, next) => {
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

app.post('/login', (req, res) => {
    console.log(users.length)
    if (users.length > 0) {
        for (let user of users) {
            console.log(user)
            if (req.body.username == user.username && req.body.password == user.password) {
                req.session.Authenticated = true;
                return res.render('profile', {Authenticated: req.session.Authenticated});
            }
        }
    }
    req.flash('error_msg', 'Username or Password incorrect');
    res.render('login', {Authenticated: req.session.Authenticated})
})

app.get('/register', (req, res) => {
    res.render('register', {Authenticated: req.Authenticated})
})

app.post('/register', (req, res) => {
    for (let user of users) 
        if (req.body.username == user.username)
            return res.render('register', {error: "username already exists", Authenticated: req.session.Authenticated})
    let user = {
        username: req.body.username,
        password: req.body.password
    }
    users.push(user)
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/login')
})

app.get('/profile', (req, res) => {
    if (req.session.Authenticated) {
        return res.render('profile', {Authenticated: req.session.Authenticated})
    }
    res.render('login', {error: "Login to see your profile", Authenticated: req.session.Authenticated})
})

app.get('/logout', (req, res) => {
    // req.flash('success_msg', 'logging out');
    req.session.destroy();
    res.redirect('/');
})

app.listen(3000, () => {
    console.log('Listening')
})