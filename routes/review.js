const express = require("express");
const router = express.Router();    
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
// const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");


const reviewController = require("../controllers/reviews.js");

//Post review route
router.post("/:id/reviews",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;