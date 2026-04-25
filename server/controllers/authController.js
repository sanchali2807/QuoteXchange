const bcrypt = require("bcryptjs");
const generateToken = require("../utils/token");
const {User} = require("../models")

const register = async(req,res)=>{
    try{
        const {name , email , password , role , companyName} = req.body;

        // check for parameters
        if(!name || !email || !password || !role || !companyName){
            return res.status(400).json({
                success : false,
                message : "All fields required!!"
            })
        }

        // Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    success: false,
    message: "Invalid email format"
  });
}


// Password validation
const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    success: false,
    message:
      "Password must be 8+ chars with uppercase, lowercase, number and special character"
  });
}

        //role check 

        if (!["buyer", "supplier"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    const existingUser = await User.findOne({
        where : {email}
    })
    if(existingUser){
        return res.status(400).json({
            success : false,
            message : "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);
    // salt rounds are done 10 times

    const user = await User.create({
        name,
        email,
        password : hashedPassword,
        // if i only write hashedPassowrd then it expects a field called hashedPassowrd
        role,
        companyName
    });

    const token = generateToken(user);

    return res.status(200).json({
        success : true,
        message : "User successfully registered",
        token
    })

    }catch(err){
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}


const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({where : {email}});
        if(!user){
            return res.status(400).json({
                success : false,
                message : "User not found"
            });
        }

        const matched = await bcrypt.compare(
            password,
            user.password
        )

    if(!matched){
        return res.status(400).json({
            success : false,
            message : "Password not same"
        })
    }
 const token = generateToken(user);
   return res.status(200).json({
      success: true,
      message : "Login successful",
      token
    });

    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Login Unsuccessful!!"
        })
    }
}

const me = (req,res) =>{
    return res.status(200).json({
        success : true,
        message : req.user
    })
}

module.exports = {register,login,me};

// Register may auto-login and return token.
// Later token may expire / be deleted.
// User logs in again.
// Backend returns fresh token