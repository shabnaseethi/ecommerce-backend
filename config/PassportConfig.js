const LocalStrategy = require("passport-local").Strategy;
const { client } = require("./dbconfig");
const bcrypt = require("bcrypt");
const UserModel = require("../Models/userModel");
const UserModelInstance = new UserModel();

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    
    const user = await UserModelInstance.getUserByEmail(email.toLowerCase());
    if (user === null) {
      return done(null, false, { message: "No User Found!!!!" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "passwords donot match" });
      }
    } catch (error) {
        return done(error);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null,user.id));
  passport.deserializeUser(async (id, done) => done(null,await UserModelInstance.getUserById(id)));
}

module.exports = initialize;
