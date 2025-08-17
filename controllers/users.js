const User = require("../models/user.js");


module.exports.renderSignUp = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const regiUser = await User.register(newUser, password);
        console.log(regiUser);
        req.login(regiUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("sucess", "User Registered");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "logged in");
    let redirectURL = res.locals.redirectURL || "/listings";
    res.redirect(redirectURL);
}

module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "Logged out.");
        res.redirect("/listings");
    })
} 