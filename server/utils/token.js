const jwt = require("jsonwebtoken");

const generateToken = (user)=>{
    return jwt.sign(
        {
            // PAYLOAD
            id : user.id,
            name : user.name,
            email : user.email,
            role : user.role,
            companyName : user.companyName
        },
        // SECRET KEY
        process.env.JWT_SECRET,
        // OPTIONS
        {
            expiresIn : "2d"
        }
    );
}
module.exports = generateToken;