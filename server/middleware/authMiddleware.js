const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{
// middleware has three arguements
try{
    // header og the request contains the token
    
    const header = req.headers.authorization;
    // console.log(req.headers);

// console.log("HEADER =", header);
// console.log("TYPE =", typeof header);
// console.log("CHARS =", [...header]);
    if(!header || !header.startsWith("bearer ")){
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
    console.log(err);
    res.status(401).json({
        success : false,
        message : "Invalid Token"
    });
}
}

module.exports = authMiddleware;