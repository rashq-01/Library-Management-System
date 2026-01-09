require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");


const DB_PATH = process.env.DB_PATH;
const PORT = process.env.PORT;

const app = express();

app.use(express.static(path.join(__dirname,"../client")));

app.get("/",(req,res)=>{
    return res.sendFile(path.join(__dirname,"../client/index.html"));
})

mongoose.connect(DB_PATH).then(()=>{
    console.log("MongoDB Connected");
    
    app.listen(PORT,()=>{
        console.log(`Server started on http://localhost:${PORT}`);
    });
}).catch((err)=>{
    console.log("Connection to the MongoDB failed.");
    console.log(err.message);
});