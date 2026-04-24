const jwt = require("jwtwebtoken");

const authMiddleware = (req,res,next)=>{
// middleware has three arguements
try{
    // header og the request contains the token
    const header = jwt.header.authentication;

    if(!header || !header.startsWith("Bearer ")){
        return res.status(401).json({
            success : false,
            message : "No Token Provided or the syntax is wrong"
        })
    }
    const token = header.split(" ")[1];

    // here the token passed is encoded with secret key and again verified with the signature
    const decoded = jwt.verify(
        token , 
        process.env.JWT_SECRET
    )
    req.user = decoded;
    next();
}catch(err){
    res.status(401).json({
        success : false,
        message : "Invalid Token"
    });
}
}

module.exports = authMiddleware;