require("dotenv").config();
const express = require("express");
const app = express();
const client = require("./config/dbconfig");
const productRouter = require("./Routes/productRoutes");
const loginRouter = require("./Routes/loginRoutes");
const customerRouter = require("./Routes/CustomerRoutes");
const cartRouter = require("./Routes/cartRoutes");
const orderRouter = require("./Routes/orderRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
var cookieParser = require("cookie-parser");
const stripeRouter = require("./Routes/StripeRoutes");
const passport = require("passport");
const initializePassport = require("./config/PassportConfig");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce REST API ",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./swagger.yml"], // files containing annotations as above
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));

initializePassport(passport);

app.use("/webhook", bodyParser.raw({ type: "*/*" }));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    credentials: true,
    resave: false,
    saveUninitialized: false,
  })
);
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


client.connect();
app.use("/products", productRouter);
app.use("/", loginRouter);
app.use("/", customerRouter);
app.use("/", cartRouter);
app.use("/", stripeRouter);
app.use("/", orderRouter);

const PORT = process.env.PORT;
app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.ENDPOINT}:${process.env.PORT}`);
});
