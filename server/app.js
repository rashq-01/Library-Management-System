// Modules
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.static(path.join(__dirname,"../client")));





//Routes
const authRouter  = require("./routes/authRoute.js")
const bookRouter  = require("./routes/bookRoute.js")
const issueRouter  = require("./routes/issueRoute.js")
const userRouter  = require("./routes/userRoute.js");
const auth = require("./middleware/authMiddleware.js");




app.get("/",(req,res)=>{
    return res.sendFile(path.join(__dirname,"../client/index.html"));
})

app.use("/api",authRouter);
app.use("/api",userRouter);
app.use("/api",bookRouter);
app.use("/api",issueRouter);


module.exports = app;
