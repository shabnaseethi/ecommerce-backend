const express=require("express");
const router = express.Router();
const { createProduct,getProductById,getProducts } = require('../Controllers/productController');



router.post('/',createProduct);
router.get('/',getProducts);
router.get('/:id',getProductById);

  
module.exports= router;