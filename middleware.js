const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    // console.log(req.path, "and", req.originalUrl);   this will print which path that user click before signin or sign up we use this because to redirect the user to the required url that he is click
    if(!req.isAuthenticated()) {  // we used this to check whether the user is login or not with the helpp of passport
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to update the listing");
        return res.redirect("/login");
    }
    next(); 
};

//we use this method because passport delete the saveRedirectUrl once it start operation. so we save the redirectUrl to locals
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//to know that the listing is belongs to the user or not
module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to update the listing");
        return res.redirect(`/listings/${id}`);  //if we don't use the return the lines after the if statement also execute!
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    // console.log(result);
    if(error) {
        let errMsg = error.details.map((el) => el.message.join(","));
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    // console.log(result);
    if(error) {
        let errMsg = error.details.map((el) => el.message.join(","));
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async(req, res, next) => {
    let {reviewId, id} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this Review to delete");
        return res.redirect(`/listings/${id}`);  //if we don't use the return the lines after the if statement also execute!
    }
    next();
}