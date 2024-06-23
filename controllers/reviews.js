const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);  //here reviews  is an array that is present inside the listing.js
    // console.log(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New review is added");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=>{
    let { id,reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review is deleted");
    res.redirect(`/listings/${id}`);
};