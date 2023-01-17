require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
  verifyAccessToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === undefined || token ===null)
    return res.status(401).json({ error: "No valid Token" });
    else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(403).send({message:"Token is expired"});
        }
        req.user = user;
        next();
      });
    }
  },
  verifyRefreshToken: (req, res, next) => {
    const token = req.body.token;

    if (token === null) return { error: "NOT VALID TOKEN" };
    else {
      const values = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) {
            console.log("errr");
          }
          req.token = token;
          next();
        }
      );
    }
  },
};
