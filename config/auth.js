module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/users/login');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/dashboard');      
    }
  };

//es6
// export function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     req.flash('error_msg', 'Please log in to view that resource');
//     res.redirect('/users/login');
// }
// export function forwardAuthenticated(req, res, next) {
//     if (!req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/dashboard');
// }