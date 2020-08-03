const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/isAuth');







router.get('/', (req, res) => {
    res.render('index', {Authenticated: req.isAuthenticated()})   
});


router.get('/login', (req, res) => {
    res.render('login', {Authenticated: req.isAuthenticated()})
})

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });

router.post('/login', 
    }))
      


router.get('/register', (req, res) => {
    res.render('register', {Authenticated: req.Authenticated})
})

router.post('/register', async (req, res) => {
    let {username, email, password} = req.body;
    const confirmationString = Math.random().toString(12).slice(-14) 
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
        "local.password": hashedPassword,
        "local.confirmation_string": confirmationString
    })
    newUser.save()
    .then(u => {
        const url = `http://localhost:3000/confirmation/${confirmationString}`
        let testAccount = nodemailer.createTestAccount((err, testAccount) => {
            console.log(email)
            console.log('send')
            const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth:{
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            transporter.sendMail({
                from: testAccount.user,
                to: email,
                subject: 'Confirm Email',
                html: `Click this link to confirm your email address: <a href="${url}">${url}</a>`
            })
        });
        req.flash('success_msg', 'Confirm your email to login.');

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

router.get('/confirmation/:token', async (req, res) => {
    try {
        await User.update({"local.confirmation_string": req.params.token}, {"local.confirmed": true})
    } catch (e) {
        console.log(e)
    }
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
})

module.exports = router;