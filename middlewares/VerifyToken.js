require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken: (req, res, next) => {
    const token = req.cookies.token;
    console.log(req.cookies.token);
    if (!token) return res.sendStatus(403);
 else{
    jwt.verify(token, process.env.ACCESS_KEY, (err, user) => {
        if (err) throw err;
        req.user = user;
        next();
      });
 }
  },
};
