const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");


const validateLsiting = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    console.log(error);
    // let errMsg =error.details.map((el)=>el.message).join(",");
    if (error) {
        throw new expressError(400, error);
    } else {
        next();
    }
}


//Index Routef
router.get("/", wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
}));


//New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
})

//Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate("reviews").populate("owner");
    if (!data) {
        req.flash("error", "Listing Does Not Exist!");
        res.redirect("/listings");
    }
    console.log(data);
    res.render("listings/show.ejs", { data })
}));


//Create Route
router.post("/", isLoggedIn, validateLsiting, wrapAsync(async (req, res, next) => {
    //    let {title,description,img,price,country,location} =req.body;

      const defaultImageURL = "https://images.unsplash.com/photo-1743856842985-e1d4fc72a255?q=80&w=2018&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    // Check and assign default if image.url is blank
    if (!req.body.listing.image || !req.body.listing.image.url.trim()) {
        req.body.listing.image = {
            url: defaultImageURL,
            filename: "default"
        };
    }

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}
));

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing Does Not Exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//Update route
router.put("/:id", isLoggedIn, validateLsiting, wrapAsync(async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");

    res.redirect(`/listings/${id}`);
}));

//Detete Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let detetedListing = await Listing.findByIdAndDelete(id);
    console.log(detetedListing);
    req.flash("success", "Listing Deleted");

    res.redirect("/listings");
}));


module.exports = router;