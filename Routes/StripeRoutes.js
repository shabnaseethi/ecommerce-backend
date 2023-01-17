require("dotenv").config();
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { createOrder } = require("../Controllers/orderController");



router.post("/checkout", async (req, res) => {
  const items = req.body.items;
  const cart = items.map((item) => {
    return { product_id: item.product_id, count: item.count };
  });

  const customer = await stripe.customers.create({
    metadata: {
      user_id: items[0].customer_id,
      cart: JSON.stringify(cart),
      orderStatus: true,
    },
  });

  const filteredLineItems = items.filter((item) => item.count > 0);
  const lineItems = filteredLineItems.map((item) => {
    return {
      price: item.api_id,
      quantity: item.count,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: { allowed_countries: ["US", "CA"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "gbp" },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 2 },
            maximum: { unit: "business_day", value: 5 },
          },
        },
      },
    ],
    customer: customer.id,
    line_items: lineItems,
    phone_number_collection: {
      enabled: true,
    },
    mode: "payment",
    success_url:
      "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/cancel?session_id={CHECKOUT_SESSION_ID}",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

const createOrderItems = async (customer, data) => {
  const items = JSON.parse(customer.metadata.cart);
  const newOrder = {
    userId: customer.metadata.user_id,
    customerId: data.customer,
    paymentIndentId: data.payment_intent,
    products: items,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  };
  createOrder(newOrder);
};

const endpointSecret =
  process.env.WEBHOOK_ENDPOINT;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let eventType;
    let data;

    if (endpointSecret) {
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          endpointSecret
        );
        console.log("Webhook verified");
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = request.body.data.object;
      eventType = request.body.type;
    }

    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          createOrderItems(customer, data);
        })
        .catch((err) => console.log(err.message));
    }

    response.send();
  }
);

// router.post("/payment", (req, res) => {
//   stripe.charges.create(
//     {
//       source: req.body.tokenId,
//       amount: req.body.amount,
//       currency: "GBP",
//     },
//     (stripeErr, stripeRes) => {
//       if (stripeErr) {
//         switch (stripeErr.type) {
//           case "StripeCardError":
//             console.log(`A payment error occurred: ${e.message}`);
//             break;
//           case "StripeInvalidRequestError":
//             console.log("An invalid request occurred.");
//             break;
//           default:
//             console.log("Another problem occurred, maybe unrelated to Stripe.");
//             break;
//         }
//       } else {
//         console.log(stripeRes);
//         res.status(200).json(stripeRes);
//       }
//     }
//   );
// });

module.exports = router;
