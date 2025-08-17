if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const dbUrl = process.env.ATLASDB_URL
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStategy = require("passport-local");
const User = require("./models/user.js");



const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));




async function main() {
    await mongoose.connect(dbUrl);
}
main().then(() => {
    console.log("Succesfully Connected to DB wanderLust");
}).catch((err) => {
    console.log("some Error Occured", err);
})


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
store.on("error", (err) => {
    console.log("error in mongo session store", err)
});

const sessionOption = {
    store,
    secret: process.env.SECRET
    ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//root
// app.get("/", (req, res) => {
//     res.send("this is root");
// })



passport.use(new LocalStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student1@gmail.com",
//         username: "delta-student01"
//     });
//     let regUser = await User.register(fakeUser, "helloworld");
//     res.send(regUser);
// });


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// app.all("*",(req,res,next)=>{
//     next(new expressError(404,"page not found"));
// })

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong." } = err;
    res.render("error.ejs", { message });
    // res.status(statusCode).send(message);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`server is listening on ${port}`);
});


// app.listen(8080, () => {
//     console.log("server is listining on 8080");
// }); 