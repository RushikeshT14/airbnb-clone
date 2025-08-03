const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");

});

router.post("/signup", wrapAsync(async (req, res) => {
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

}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", savedRedirectUrl, passport.authenticate('local', { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    req.flash("success", "logged in");
    let redirectURL = res.locals.redirectURL || "/listings";
    res.redirect(redirectURL);
});


router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "Logged out.");
        res.redirect("/listings");
    })
});

module.exports = router;