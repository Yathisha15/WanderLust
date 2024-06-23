//to use express router
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/expressError.js");
// const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");  //we use this to check whether the user is logged in  or not
//files for MVC(Model,View,Controller)
const listingController = require("../controllers/listings.js");
const multer  = require('multer');//we use this to parse the form data when we are going to upload some images
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); //so now we use file to save Data, after we are going to use third party cloud services(aws,cloud,asure, etc)

router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync( listingController.createListing ));

//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(  isLoggedIn, isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//index route
// router.get("/",wrapAsync(listingController.index));//for this we use router.route method which will combine many paths that they have same path



//show route
// router.get("/:id",wrapAsync(listingController.showListing));

//create route
// router.post("/", validateListing,isLoggedIn, wrapAsync( listingController.createListing )); //here validate listing is a middleware

//edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//update route
// router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync(listingController.updateListing));

//delete route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;