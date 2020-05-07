const express = require('express');
const path = require('path');
const session = require('express-session');

let app = express();

var users = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.render('index', {Authenticated: req.Authenticated})   
});

app.get('/login', (req, res) => {
    res.render('login', {error: false, Authenticated: req.Authenticated})
})

app.post('/login', (req, res) => {
    console.log(users.length)
    if (users.length > 0) {
        for (let user of users) {
            console.log(user)
            if (req.body.username == user.username && req.body.password == user.password) {
                req.Authenticated = true;
                return res.render('profile', {Authenticated: req.Authenticated});
            }
        }
    }
    res.render('login', {error: "Username or Password incorrect", Authenticated: req.Authenticated})
})

app.get('/register', (req, res) => {
    res.render('register', {Authenticated: req.Authenticated, error: false})
})

app.post('/register', (req, res) => {
    for (let user of users) 
        if (req.body.username == user.username)
            return res.render('register', {error: "username already exists", Authenticated: req.Authenticated})
    let user = {
        username: req.body.username,
        password: req.body.password
    }
    users.push(user)
    res.redirect('/login')
})

app.get('/profile', (req, res) => {
    if (req.Authenticated) {
        return res.render('profile')
    }
    res.render('login', {error: "Login to see your profile", Authenticated: req.Authenticated})
})

app.listen(3000, () => {
    console.log('Listening')
})