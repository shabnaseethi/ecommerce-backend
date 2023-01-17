
const client = require("../config/dbconfig");

module.exports = {
  getShoppingcart:async(req,res)=>{
    if(req.user){
      res.status(200).json(req.user);
     }
     else{
      res.status(401).json({message:"Not Authenticated"})
     }

  },
  createCart: async (req, res) => {
    const body = req.body;
    if(req.body.product.product.user_id){
      const cartItem = await client.query(
        `insert into cart(customer_id,product_id,count,price) values ($1,$2,$3,$4) returning customer_id,product_id,count`,
        [body.product.product.user_id, body.product.product.id, 1, body.product.product.price]
      );
      const productInfo = await client.query(`SELECT * FROM product where id=$1`,[body.product.product.id]);
      res.send({customer_id:cartItem.rows[0].customer_id,product_id:productInfo.rows[0].id,count:cartItem.rows[0].count,
      name:productInfo.rows[0].name,image:productInfo.rows[0].image,price:productInfo.rows[0].price,api_id:productInfo.rows[0].api_id});
    }
   
  },
  incrementCart: async (req, res) => {
    const body = req.body;
    const existingUser = await client.query(
      `SELECT * FROM cart where customer_id=$1 and product_id=$2`,
      [body.user_id, body.product_id]
    );
    
    if (existingUser.rows.length > 0) {
      const cartItem = await client.query(
        `update cart set count=$1, price = $2 where product_id=$3 returning product_id,count`,
        [existingUser.rows[0].count + 1,body.price*(existingUser.rows[0].count + 1), body.product_id]
      );
      res.send(cartItem.rows[0]);
    }
  },
  decrementCart: async (req, res) => {
    const body = req.body;
    const existingUser = await client.query(
      `SELECT * FROM cart where customer_id=$1 and product_id=$2`,
      [body.user_id, body.product_id]
    );
    if (existingUser.rows.length > 0) {
      if (existingUser.rows[0].count > 1) {
        const cartItem = await client.query(
          `update cart set count=$1 ,price =$2 where product_id=$3 returning product_id,count`,
          [existingUser.rows[0].count - 1,body.price*(existingUser.rows[0].count-1), body.product_id]
        );
        res.send(cartItem.rows[0]);
      }
      else{
       await client.query(`delete from cart where  product_id =$1`,[body.product_id]);
        res.send({cartCount:0,product_id:body.product_id});
      }
      
      
    }
  },
  getCart:async(req,res)=>{
    const id = req.params.id;

   if(id){
    const cartList = await client.query(
      `SELECT cart.customer_id,cart.product_id,cart.count,product.name,product.image,product.price,product.api_id FROM cart INNER join product ON product.id = cart.product_id where customer_id=$1`,
      [id]
    );
  
    res.send(cartList.rows)
   }
   else{
    res.send("Bad Request")
   }
  },
  removeCart:async(req,res)=>{
    const body = req.body;
    await client.query(`delete from cart where  product_id =$1 and customer_id=$2`,[body.product_id,body.customer_id]);
        res.send({cartCount:0,product_id:body.product_id});
  },
  deleteCart:async(req,res)=>{
    const id = req.params.id;
    const deleteCart = await client.query(`select * from cart where customer_id=$1`,[id]);
        if(deleteCart.rows.length>0){
          const removeCart = await client.query(`delete from cart where customer_id=$1 returning *`,[id]);
          res.send({cart:removeCart.rows[0]});
        }
        else{
          res.send({message:"No data Found"});
        }

  }
};
