const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
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

app.post('/login', (req, res) => {
    console.log(users.length)
    password = req.body.password;
    for (let user of users) {
        console.log('hi')
            bcrypt.compare(password, user.password)
                .then(match => {
                    console.log('matched')
                    if (match) {
                        console.log('logged in')
                        req.session.Authenticated = true;
                        req.session.user = req.body.username;
                        return res.redirect('/profile');
                    } else {

                        req.flash('error_msg', 'Username or Password incorrect');
                        return res.redirect('/login')
                    }        
                })
                .catch(error => console.log('error' + error))
            
    }
    console.log('2 time?')
    req.flash('error_msg', 'Username or Password incorrect');
    res.redirect('/login')
    // res.render('login', {Authenticated: req.session.Authenticated})
})

app.get('/register', (req, res) => {
    res.render('register', {Authenticated: req.Authenticated})
})

app.post('/register', async (req, res) => {
    for (let user of users) {
        if (req.body.username == user.username) {
            req.flash('error_msg', 'Username already exists');
            return res.redirect('/register')
            // return res.render('register', {Authenticated: req.session.Authenticated})
        }
    }
    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    let user = {
        username: req.body.username,
        password: hashedPassword
    }
    users.push(user)
    console.log('rererererere')
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('login');
    // res.render('login', {Authenticated: req.session.Authenticated})
})

app.get('/profile', (req, res) => {
    if (req.session.Authenticated) {
        return res.render('profile', {Authenticated: req.session.Authenticated})
    }
    req.flash('error_msg', 'Login to see your profile')
    res.render('login', {Authenticated: req.session.Authenticated})
})

app.get('/logout', (req, res) => {
    // req.flash('success_msg', 'logging out');
    req.session.destroy();
    res.redirect('/');
})

app.listen(3000, () => {
    console.log('Listening')
})