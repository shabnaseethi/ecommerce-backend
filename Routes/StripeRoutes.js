require("dotenv").config();
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", (req, res) => {
  console.log(req.body);
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount:req.body.amount,
      currency:"GBP"
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        switch (stripeErr.type) {
          case "StripeCardError":
            console.log(`A payment error occurred: ${e.message}`);
            break;
          case "StripeInvalidRequestError":
            console.log("An invalid request occurred.");
            break;
          default:
            console.log("Another problem occurred, maybe unrelated to Stripe.");
            break;
        }
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
   
});

module.exports = router;
