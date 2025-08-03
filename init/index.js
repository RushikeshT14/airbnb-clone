const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("Succesfully Connected to DB wanderLust");
}).catch((err) => {
    console.log("some Error Occured", err);
})


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, owner:'688f19013c488dfde7213e87'
    }))
    await Listing.insertMany(initData.data);
    console.log("data Saved");
}

initDB();
