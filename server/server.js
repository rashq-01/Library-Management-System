require("dotenv").config();

const app = require("./app.js");
const connectDB = require("./config/db.js");

const PORT = process.env.PORT;
const HOST = process.env.HOST;

connectDB().then(()=>{
    console.log("MongoDB Connected");
    
    app.listen(PORT,HOST,()=>{
        console.log(`Server started on http://${HOST}:${PORT}`);
    });
}).catch((err)=>{
    console.log("Connection to the MongoDB failed.");
    console.log(err.message);
});