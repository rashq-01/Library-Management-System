function roleMiddleware(requiredRole){
    return function(req,res,next){
        if(!req.user){
            return res.status(401).json({
                success : false,
                message : "Authentication failed"

            })
        }

        if(req.user.role != requiredRole){
            return res.status(403).json({
                success : false,
                message : "Access Denied"
            });
        }

        next();
    }
}


module.exports = roleMiddleware;