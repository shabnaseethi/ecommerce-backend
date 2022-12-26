require("dotenv").config();
const passport = require("passport");
const client = require("../config/dbconfig");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_KEY;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
 
  client.query(`SELECT * FROM customer WHERE id=$1`,[jwt_payload.id], function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
          console.log(user.rows[0]);
            return done(null, user.rows[0]);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));