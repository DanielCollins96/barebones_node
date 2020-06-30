const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const bcrypt = require('bcryptjs');

// let User = require('../models/User');

module.exports = (passport) => {

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

    passport.use(new LocalStrategy({usernameField: 'email'}, function(email, password, done) {
        User.findOne({email: email})
                .then(user => {
                    console.log(user)
                    if (!user) { 
                        return done(null, false, { error_msg: 'That email is not registered' }) 
                    }
                
                    bcrypt.compare(password, user.local.password, (err, isMatch) => {
                    if (err) throw err;
                    if(isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { error_msg: 'Incorrect Password' })
                    }
                })
        });
    }))

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({ "google.id" : profile.id }, function (err, user) {
      if (err)
        return cb(err);
      if (user) {
          return cb(null, user);
      }  else {
          let newUser = User();
          newUser.google.id = profile.id;
          newUser.google.token = refreshToken;
          newUser.google.email = profile.emails[0].value;
          newUser.save(function(err) {
            if (err)
                throw err;
            return cb(null, newUser);
        });
          return cb(err, user);
        }
    });
  }
));
}