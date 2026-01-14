require("dotenv").config();
const jwt = require("jsonwebtoken");

function auth(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        console.log("No Token Provided");
        return res.status(401).json({
            success : false,
            message : "No Token Provided"
        })
    }
    if(!authHeader.startsWith("Bearer ")){
        return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const SECRET_KEY = process.env.SECRET_KEY;
        const decoded = jwt.verify(token,SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success : false,
            message : "Session expired. Please login again."
        });
    }
}

module.exports = auth;