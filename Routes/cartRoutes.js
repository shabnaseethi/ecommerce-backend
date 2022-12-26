

const express=require("express");
const router = express.Router();
const {createCart,incrementCart,decrementCart,getCart,removeCart} = require("../Controllers/cartController");



router.post('/addCart',createCart);
router.post('/increment',incrementCart);
router.post('/decrement',decrementCart);
router.post('/cart',getCart);
router.post('/remove',removeCart);

  
module.exports= router;