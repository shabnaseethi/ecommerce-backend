require("dotenv").config();
const express = require("express");
const router = express.Router();
const passport = require("passport");


router.get("/dashboard", checkAuthenticated, (req, res) => {

  res.status(200).json({ message: "successDashboard", user: req.user });
});
router.get("/home", checkAuthenticated, (req, res) => {

  res.status(200).json({ message: "successDashboard", user: req.user });
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.status(401).json({ message: "Not Authenticated" });
});

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Loggedout successfully" });
  });
});

router.get("/home", checkAuthenticated, (req, res) => {
  res.send({ message: "Success" });
});
function checkAuthenticated(req, res, next) {
 
  if (req.isAuthenticated()) {

     return next();
  }
 else{
  res.redirect("/login");
 }
}

function checkNotAuthenticated(req, res, next) {

  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  next();
}

module.exports = router;
