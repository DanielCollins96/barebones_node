const LocalStrategy = require('passport-local').Strategy;
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
                
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if(isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { error_msg: 'Incorrect Password' })
                    }
                })
        });
    }))
}