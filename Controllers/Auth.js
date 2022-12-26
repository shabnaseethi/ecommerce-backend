require("dotenv").config();
const client = require("../config/dbconfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sign } = require("jsonwebtoken");

module.exports = {
  dashboard: async (req, res) => {
    if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user });
    } else {
      res.send({ loggedIn: false });
    }
  },

  loginUser: async (req, res) => {
    // validateForm(req, res);
    const potentialLogin = await client.query(
      "SELECT id, email, password,first_name,last_name FROM customer u WHERE u.email=$1",
      [req.body.email]
    );

    if (potentialLogin.rowCount > 0) {
      const isSamePass = await bcrypt.compare(
        req.body.password,
        potentialLogin.rows[0].password
      );
      if (isSamePass) {
        req.session.user = {
          username: req.body.email,
          id: potentialLogin.rows[0].id,
          first_name: potentialLogin.rows[0].first_name,
          last_name: potentialLogin.rows[0].last_name,
        };
        res.json({
          loggedIn: true,
          username: req.body.email,
          id: potentialLogin.rows[0].id,
          first_name: potentialLogin.rows[0].first_name,
          last_name: potentialLogin.rows[0].last_name,
        });
      } else {
        res.json({ loggedIn: false, status: "Wrong username or password!" });
        console.log("not good");
      }
    } else {
      console.log("not good");
      res.json({ loggedIn: false, status: "Wrong username or password!" });
    }
  },
  getLogin: (req, res) => {
    if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user });
    } else {
      res.send({ loggedIn: false });
    }
  },

  logout: (req, res, next) => {
    req.session.destroy();
    res.status(200).send({ loggedIn: false });
  },
};
