exports.requireLogin = (req, res, next) => {
    if (!req.session.userId) {
      req.flash('error_msg', 'You must be signed in to access this page');
      return res.redirect('/login');
    }
    next();
  };
  