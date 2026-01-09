//1. Import

// External and Internal module
const express = require("express");
const path = require("path");
const cors = require("cors");

// Middlewares
// const authMiddleware = require("./middleware/authMiddleware.js");
// const roleMiddleware = require("./middleware/roleMiddleware.js");

//Routes
// const authRoute  = require("./routes/authRoute.js")
// const bookRoute  = require("./routes/bookRoute.js")
// const issueRoute  = require("./routes/issueRoute.js")

// 2. Creating express app()
const app = express();

// 3. Global middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.static(path.join(__dirname,"../client")));


// 4. Static Frontend

app.get("/",(req,res)=>{
    return res.sendFile(path.join(__dirname,"../client/index.html"));
})

// 5. Routes




// 6. Export app

module.exports = app;
