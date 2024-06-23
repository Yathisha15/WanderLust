if(process.env.NODE_ENV != "production") {      //we use this if statement because we are under development stage but once it release to production stage it will visible to all others,so we hide the credentials and some secrete things here, so we use this to avoid in production stage.
    require('dotenv').config();
}


const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
// const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL; //we use this because to deploy our website to cloud


// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");   //this we can't use for production or online purposes so we use connect-mongo(see next line)
const MongoStore = require('connect-mongo');
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");  
const userRouter = require("./routes/user.js");

main().then(() => {
    console.log("connection successfull");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));//to use request.params
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);//to use ejs mate for this we use layouts folder
app.use(express.static(path.join(__dirname,"/public")));//to use static file(public folder) 


//to use joi or to validate schema
// const validateListing = (req, res, next) => {
//     let {error} = listingSchema.validate(req.body);
//     // console.log(result);
//     if(error) {
//         let errMsg = error.details.map((el) => el.message.join(","));
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// }

// const validateReview = (req, res, next) => {
//     let {error} = reviewSchema.validate(req.body);
//     // console.log(result);
//     if(error) {
//         let errMsg = error.details.map((el) => el.message.join(","));
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// }

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error", () => {
    console.log("Error in MONGO SESSION Store", err);
});

//too use express-session
const sessionOptions = {
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 *1000,  //it sets an expore date to our cookies
        maxAge: 7 * 24 * 60 * 60 *1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());  //we have to use the flash before creating the routes.
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;  //to use req.user in navbar.ejs file
    next();
});

// app.get("/demoUser", async(req,res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta"
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter); //to use express router folder: routes file:listing.js
//we remove the listing route that we use previously because when we go to any route like /listings/review the middleware alredy contain .listings so we need just /reviews we may seee this in listing.js file inside routes folder
// we create a seperate folder for express router i.e routes and file name listing.js

app.use("/listings", reviewRouter); //here we use /listings/:id/reviews route because this route is common in both routes in review.js file but we dont use because we have anther sepearte route to redirect.
app.use("/",userRouter);


// app.get("/",(req,res)=>{
//     res.render("./listings/home.ejs");
// });
// //index route
// app.get("/listings",wrapAsync(async(req,res) => {
//     const allListings = await Listing.find({});
//     res.render("./listings/index.ejs",{allListings});
// }));

// //new route
// app.get("/listings/new", (req,res) => {
//     res.render("./listings/new.ejs");
// });

// //Create route
// // app.post("/listings",async(req,res)=>{
// //     let {title,description,image,price,location,country} = req.body;
// //     let newListing = new Listing({
// //         title:title,
// //         description:description,
// //         image:image,
// //         price:price,
// //         location:location,
// //         country:country
// //     });
// //     await newListing.save();
// //     res.redirect("/listings");
// // });
// app.post("/listings", validateListing, wrapAsync(async (req, res) => {  //here validate listing is a middleare
//     // if(!req.body.listing) {
//     //     throw new ExpressError(400,"Send valid data  for listing!");
//     // }
//     const newListing = new Listing(req.body.listing);
//     // if(!newListing.title) {
//     //     throw new ExpressError(400,"Title is missing!");
//     // }
//     // if(!newListing.description) {
//     //     throw new ExpressError(400,"Description is missing!");
//     // }
//     // if(!newListing.location) {
//     //     throw new ExpressError(400,"Location is missing!");
//     // }
//     //instead of using this much if statement we use joi like this.
//     // let result = listingSchema.validate(req.body);
//     // // console.log(result);
//     // if(result.error) {
//     //     throw new ExpressError(400, result.error);
//     // } //we use this in above
//     await newListing.save();
//     res.redirect("/listings");
// }));

// //show route
// app.get("/listings/:id",wrapAsync(async(req,res)=>{
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews"); //to get the reviews that enter by user to show.ejs we use populate
//     res.render("./listings/show.ejs",{listing});
// }));

// //edit route
// app.get("/listings/:id/edit", wrapAsync(async(req,res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("./listings/edit.ejs",{listing});
// }));

// //update route
// app.put("/listings/:id", validateListing, wrapAsync(async(req,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect("/listings");
// }));

// //delete route
// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }));

// //reviews
// //Post review route
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);  //here reviews  is an array that is present inside the listing.js

//     await newReview.save();
//     await listing.save();

//     res.redirect(`/listings/${listing._id}`);
// }));

// //delete review route
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let { id,reviewId } = req.params;
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}})
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`)
// }));

// app.get("/testListing",async(req,res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "madikeri, Bengaluru",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successfully testing");
// });

app.all("*",(req, res, next) => {
    next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next) => {
    let {statusCode=500, message="Something went wrong, Please again later!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
})

app.listen(port,() => {
    console.log(`The app is listen at port ${port}`);
});