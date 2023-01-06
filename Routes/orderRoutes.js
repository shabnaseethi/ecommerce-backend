const express=require("express");
const router = express.Router();
const {getOrder, createOrder,getAllOrders} =require("../Controllers/orderController")
const stripe = require("stripe")(process.env.STRIPE_KEY);


router.post('/makeorder',createOrder);
router.post('/order',getOrder);
router.post('/allorder',getAllOrders);
router.get('/success', async (req, res) => {
    if(req.query.session_id){
      const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    const customer = await stripe.customers.retrieve(session.customer);
   
    res.send({data:customer.metadata.orderStatus});
    }
    else{
      res.send({data:false});

    }
  });
  router.get('/cancel',async(req,res)=>{
    if(req.query.session_id){
      const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    const customer = await stripe.customers.retrieve(session.customer);
    res.send({data:customer.metadata.orderStatus});
    }
    else{
      res.send({data:false});

    }
  })

module.exports= router;