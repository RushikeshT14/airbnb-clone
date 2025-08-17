const { session } = require("passport");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const expressError = require("./utils/expressError.js");
const Reviews = require("./models/review.js");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //redirectURL
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login first");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // if (!currUser && listing.owner._id.equals(res.locals.currUser._id)) {
    if (!req.user || !listing.owner.equals(req.user._id)) {
        req.flash("error", "Permission Denied")
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body.Listing);
    console.log(error);
    // let errMsg =error.details.map((el)=>el.message).join(",");
    if (error) {
        throw new expressError(400, error);
    } else {
        next();
    }


}


module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
    // let errMsg =error.details.map((el)=>el.message).join(",");
    if (error) {
        throw new expressError(400, error);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Access Denied");
        return res.redirect(`/listings/${id}`);

    }
    next();
}