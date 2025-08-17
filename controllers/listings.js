const Listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
}


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!data) {
        req.flash("error", "Listing Does Not Exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { data })
}

module.exports.createListing = async (req, res, next) => {
    //    let {title,descaaription,img,price,country,location} =req.body;

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

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing Does Not Exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let detetedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}