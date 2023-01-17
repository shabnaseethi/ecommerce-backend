require("dotenv").config();
const express = require("express");
const app = express();
const client = require("./config/dbconfig");
const passport = require("passport");
const loginRouter = require("./Routes/loginRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
var cookieParser = require("cookie-parser");
const initializePassport = require("./config/PassportConfig");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ecommerce-pern-app.onrender.com",
    ],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

app.use("/", loginRouter);

client.connect();
const PORT = process.env.PORT;
app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.ENDPOINT}:${process.env.PORT}`);
});
