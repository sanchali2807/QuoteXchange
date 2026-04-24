const jwt = require("jwtwebtoken");

const generateToken = (user)=>{
    return jwt.sign(
        {
            // PAYLOAD
            id : user.id,
            name : user.name,
            email : user.email,
            role : user.role
        },
        // SECRET KEY
        process.env.JWT_SECRET,
        // OPTIONS
        {
            expiresIn : "7d"
        }
    );
}
module.exports = generateToken;