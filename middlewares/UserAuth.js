require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
  userAuth: (req, res, next) => {
    console.log(req.cookies);
    const token = req.cookies.token;
let user;
    try {
        console.log(token);
       user = jwt.verify(token, process.env.JWT_KEY);
      console.log(user);

    } catch (error) {
      console.log(error);

      return res.status(401).json({
        message: "Invalid Token.",
      });
    }
    req.user = user;
    // return res.status(200).json({
    //     user:user
    // })
    next();
  },
};
