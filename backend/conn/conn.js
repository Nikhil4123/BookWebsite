const mongoose = require("mongoose");
const config = require("../config");
 
const conn = async () => {
    try {
        await mongoose.connect(config.mongoURI);
        console.log("✅ Connected to Database");
    } catch(error) {
        console.error("❌ Database connection error:", error);
        process.exit(1);
    }
};

conn();