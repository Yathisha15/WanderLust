const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connection successfull");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(mongo_url);
}

const initDB = async () => {
    await Listing.deleteMany({}); //to delete the existing data in database
    initData.data = initData.data.map((obj) => ({...obj, owner: "666b1a937e4b6610377af81d"}));  //here we use this line to add owner to the database, because we are going to create owner id after creating all things. note: owner id must be same for all listings.
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();