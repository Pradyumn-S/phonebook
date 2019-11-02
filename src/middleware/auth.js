const auth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

const noAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }

    next();
}

module.exports = { auth, noAuth };