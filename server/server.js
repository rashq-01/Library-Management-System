require("dotenv").config();

const app = require("./app.js");
const connectDB = require("./config/db.js");

const PORT = process.env.PORT;

connectDB().then(()=>{
    console.log("MongoDB Connected");
    
    app.listen(PORT,()=>{
        console.log(`Server started on http://localhost:${PORT}`);
    });
}).catch((err)=>{
    console.log("Connection to the MongoDB failed.");
    console.log(err.message);
});