const express = require("express");
const router = express.Router();
const {
  createCart,
  incrementCart,
  decrementCart,
  getCart,
  removeCart,
  deleteCart,getShoppingcart
} = require("../Controllers/cartController");
const { verifyAccessToken } = require("../middlewares/VerifyToken");

router.get("/shoppingcart",verifyAccessToken,getShoppingcart);
router.post("/addCart", createCart);
router.post("/increment", incrementCart);
router.post("/decrement", decrementCart);
router.get("/cart/:id", getCart);
router.post("/remove", removeCart);
router.delete("/deletecart/:id", deleteCart);

module.exports = router;
