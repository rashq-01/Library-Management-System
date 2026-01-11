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
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        console.log(decoded);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success : false,
            message : "Invalid or Expired Token"
        });
    }
}

module.exports = auth;