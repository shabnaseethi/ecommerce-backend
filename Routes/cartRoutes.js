

const express=require("express");
const router = express.Router();
const {createCart,incrementCart,decrementCart,getCart,removeCart,deleteCart} = require("../Controllers/cartController");



router.post('/addCart',createCart);
router.post('/increment',incrementCart);
router.post('/decrement',decrementCart);
router.get('/cart/:id',getCart);
router.post('/remove',removeCart);
router.delete('/deletecart/:id',deleteCart);

  
module.exports= router;