const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String
        // required: true
    },
    email: {
        type: String,
        unique: true
        // required: true
    },
    
    local : {
        password: {
            type: String
            // required: true
        },
        confirmed: {
            type: Boolean,
            default: false
        },
        confirmation_string: {
            type: String,
            unique: true
        }
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
    // resetToken: String,
    // resetTokenExpiration: Date
    // posts: {
    //     type
    // }
});

let User = module.exports = mongoose.model('User', userSchema);

// module.exports.createUser = function(newUser, callback){
//     bcrypt.genSalt(10, function(err, salt) {
//       bcrypt.hash(newUser.password, salt, function(err, hash) {
//         newUser.password = hash;
//         newUser.save(callback);
//       });
//     });
//   }

// module.exports.getUserByUsername = function(username, callback){
//     var query = {username: username};
//     User.findOne(query, callback);
//   }
  
//   module.exports.getUserById = function(id, callback){
//     User.findById(id, callback);
//   }
  
//   module.exports.comparePassword = function(candidatePassword, hash, callback){
//     bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//       if(err) throw err;
//       callback(null, isMatch);
//     });
//   }