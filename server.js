require("dotenv").config();
const express = require("express");
const app =express();
const client = require('./config/dbconfig')
const productRouter = require("./Routes/productRoutes");
const loginRouter = require("./Routes/loginRoutes");
const customerRouter = require("./Routes/CustomerRoutes");
const cartRouter = require("./Routes/cartRoutes")
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const initializePassport = require("./config/Passport");
const passport = require("passport");
var cookieParser = require('cookie-parser');
const router = require("./Routes/productRoutes");
const stripeRouter = require("./Routes/StripeRoutes");

var path = require('path');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    credentials:true,
    name:"sid",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      expires:60*60*24,
      secure: false ,
    cookie:{
      secure:process.env.ENVIRONMENT === "production"?"true":"auto",
      httponly:true,
      sameSite:process.env.ENVIRONMENT === "production"?"none":"lax"

    }} 
  })
);

router.use(passport.initialize());
app.use(passport.session());
// initializePassport(passport); 



app.use(cors({
  origin: "http://localhost:3000",
  methods:["POST","GET"],
  credentials:true,
}));


client.connect();
app.use("/products",productRouter);
app.use("/",loginRouter);
app.use("/signup",customerRouter);
app.use("/",cartRouter);
app.use("/",stripeRouter);

const PORT = process.env.PORT;
app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.ENDPOINT}:${process.env.PORT}`);
});
