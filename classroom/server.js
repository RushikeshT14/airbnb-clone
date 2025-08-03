const express = require("express");
const app = express();
const sessions = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const sessionOptions = { secret: "rushi014", saveUninitialized: true, resave: true };

app.use(sessions(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
    res.locals.message = req.flash("success");
    res.locals.errorMsg = req.flash("err");
    next();

});

app.get("/test", (req, res) => {
    res.send("test succcessful.");
})

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    console.log(req.session.name);
    if (name === "anonymous") {
        req.flash("err", "user not registered");
    } else {
        req.flash("success", "user registred succcessfully");

    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {

    res.render("page.ejs", { name: req.session.name });
})


// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`req sended ${req.session.count} times.`);
// })

app.listen(3000, () => {
    console.log("server is started.");
})