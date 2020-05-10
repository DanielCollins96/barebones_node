const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

//Mongoose User Schema
let User = require('../models/user');
let Post = require('../models/post');

router.get('/', (req, res) => {
    res.render('index', {Authenticated: req.session.Authenticated})   
});

router.get('/login', (req, res) => {
    res.render('login', {Authenticated: req.session.Authenticated})
})

router.post('/login', async (req, res) => {
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
            // console.log(user._id);
            // console.log('logged in')
            req.session.Authenticated = true;
            req.session.user = user;
            return res.redirect('/profile');
        }
        req.flash('error_msg', 'Username or Password incorrect');
        res.redirect('/login')
        // res.render('login', {Authenticated: req.session.Authenticated})
    }) 
    })    


router.get('/register', (req, res) => {
    res.render('register', {Authenticated: req.Authenticated})
})

router.post('/register', async (req, res) => {
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

router.get('/profile', async (req, res) => {
    if (req.session.Authenticated) {
        console.log(req.session.user._id)
        let userPosts;
        // console.log(req.session)
        // let postQuery = await Post.find({author: req.session.user._id}).limit(5).exec((err, p) => {
        Post.find({author: req.session.user._id}).limit(10).sort({date: -1}).exec((err, post) => {
            if (err) {
                console.log(err);
                req.flash('error_msg', 'Error loading posts');
            }
            userPosts = post;
            console.log(userPosts)
            return res.render('profile', {Authenticated: req.session.Authenticated, posts: userPosts})
        })
    } else {
        req.flash('error_msg', 'Login to see your profile')
        res.redirect('/login')
    }
})

router.get('/logout', (req, res) => {
    // req.flash('success_msg', 'logging out');
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;