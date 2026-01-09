const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(process.env.DB_PATH);
};

module.exports = connectDB;