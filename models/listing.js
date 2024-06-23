const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({  //or we can save this above like this const Schema = mongoose.schema;
    title: {
        type:String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename : String
    },
    price: Number,
    location: String,
    country:String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});

//when we create a review inside a listing it is created in db but whe we delete the complete listing the listing only deleted but the reviews is not deleted in db to avoid this we use this
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
    
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;