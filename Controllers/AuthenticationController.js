require("dotenv").config();
const client = require("../config/dbconfig");
const bcrypt = require("bcrypt");
const { verifyRefreshToken } = require("../middlewares/VerifyToken");
const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/generateToken");
let refreshTokens = [];
module.exports = {
  getRefreshToken: (req, res) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
      res.status(403).json({MESSAGE:"You are not authenticated"});
    }
 
    if (!refreshTokens.includes(refreshToken)) {

      res.status(403).json({MESSAGE:"You are not authenticated"});
    } else {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          err && console.log(err.message);
          refreshTokens = refreshTokens.filter(
            (token) => token !== refreshToken
          );

          const newAccessToken = generateAccessToken(user);
          const newRefreshToken = generateRefreshToken(user);

          refreshTokens.push(newRefreshToken);

          res.status(200).json({
            user:user,
            accessToken:"Bearer " + newAccessToken,
            refreshToken: newRefreshToken,
          });
        }
      );
    }
  },
  dashboard: async (req, res) => {
   if(req.user){
    res.status(200).json(req.user);
   }
   else{
    res.status(401).json({message:"Not Authenticated"})
   }
  },
  loginUser: async (req, res, next) => {
    const potentialLogin = await client.query(
      "SELECT id, email, password,first_name,last_name FROM customer u WHERE u.email=$1",
      [req.body.email.toLowerCase()]
    );

    if (potentialLogin.rowCount > 0) {
      const isSamePass = await bcrypt.compare(
        req.body.password,
        potentialLogin.rows[0].password
      );

      if (isSamePass) {
        const accessToken = generateAccessToken(req.body);
        const refreshToken = generateRefreshToken(req.body);
        refreshTokens.push(refreshToken);
        req.session.user = {
          username: req.body.email,
          jwt: accessToken,
        };
        
        res.send({
          loggedIn: true,
          accessToken: "Bearer " + accessToken,
          refreshToken: refreshToken,
          user: {
            username: req.body.email,
            id: potentialLogin.rows[0].id,
            first_name: potentialLogin.rows[0].first_name,
            last_name: potentialLogin.rows[0].last_name,
          },
        });
      } else {
        res.json({ loggedIn: false, status: "Wrong username or password!" });
      }
    } else {
      res.json({ loggedIn: false, status: "Wrong username or password!" });
    }
  },
  getLogin: (req, res) => {
    if(req.user){
      res.status(200).json({user:req.user,authenticated:true});
     }
     else{
      res.status(401).json({message:"Not Authenticated",authenticated:false})
     }
  },

  logout: (req, res, next) => {
    req.session.destroy();
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.status(200).json({data:false});
  },
};
