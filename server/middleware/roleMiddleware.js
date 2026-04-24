// higher order function
// first function accepts roles which returns actual middleware 
// ...roles is a rest parameter, collects multiple parameters into an array

const roleMiddleware = (...roles) =>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success : false,
                message : "Forbidden!! Access Denied"
            });
        }
        next();
    }
}
module.exports = roleMiddleware;