require("dotenv").config();
const jwt = require("jsonwebtoken");
const { sign } = require("jsonwebtoken");


module.exports={
    generateAccessToken:(values)=>{
        
        const username = values.email;
        const user={name:username}
            const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
                expiresIn:'30s'
            });
                return accessToken;

    },
    generateRefreshToken:(values)=>{
        const username = values.email;
        const user={name:username}
            const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{
                expiresIn:'50m'
            });
                return refreshToken;
     
    }
}