const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Mongoose User Schema
// let User = require('../models/user');
// let Post = require('../models/post');







router.get('/', (req, res) => {
    res.render('index', {Authenticated: req.session.Authenticated})   
});

// router.get('/login', (req, res) => {
//     res.render('login', {Authenticated: req.session.Authenticated})
// })

router.get('/login', (req, res) => {
    res.render('login', {Authenticated: req.session.Authenticated})
})

// let mids = (req, res, next) => {
//     console.log(req);
//     next();
// }

router.post('/login', passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }))
      


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
    console.log(req.user)
    let auth = req.isAuthenticated();
    if (auth) {
        console.log(req.user._id)
        let userPosts;
        // console.log(req.session)
        // let postQuery = await Post.find({author: req.session.user._id}).limit(5).exec((err, p) => {
        Post.find({author: req.user._id}).limit(10).sort({date: -1}).exec((err, post) => {
            if (err) {
                console.log(err);
                req.flash('error_msg', 'Error loading posts');
            }
            userPosts = post;
            console.log(userPosts)
            return res.render('profile', {Authenticated: auth, posts: userPosts})
        })
    } else {
        req.flash('error_msg', 'Login to see your profile')
        res.redirect('/login')
    }
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
})

module.exports = router;