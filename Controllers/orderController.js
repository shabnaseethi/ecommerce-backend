const client = require("../config/dbconfig");

module.exports = {
  createOrder: async (body) => {
    const shipping_id = await client.query(
      `insert into shipping_address(address_line,city,postal_code,country) values($1,$2,$3,$4) returning id`,
      [
        body.shipping.address.line1 + " " + body.shipping.address.line2,
        body.shipping.address.city,
        body.shipping.address.postal_code,
        body.shipping.address.country,
      ]
    );
    var currentdate = new Date();
    var datetime =
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear();

    const orderItem = await client.query(
      `insert into order_details (customer_id,customer,subtotal,shipping_address_id,status,ordered_on) VALUES
          ($1,$2,$3,$4,$5,$6) returning id`,
      [
        body.userId,
        body.customerId,
        body.subtotal/100,
        shipping_id.rows[0].id,
        "order placed",
        datetime,
      ]
    );

    body.products.map((product) => {
      const orderDetails = client.query(
        `insert into order_items (order_id,product_id,count) VALUES
          ($1,$2,$3) returning id`,
        [orderItem.rows[0].id, product.product_id, product.count]
      );
    });

    
  },
  getOrder: async (req, res) => {
    const body = req.body;
    const orderList = await client.query(
      `SELECT order_details.subtotal,order_details.status,
      order_details.ordered_on,order_items.product_id,order_items.count,
      product.price,product.name,product.image,shipping_address.address_line,
                shipping_address.city,shipping_address.postal_code,shipping_address.country
                FROM order_details INNER join order_items ON order_items.order_id=order_details.id AND order_details.id=(
                  SELECT MAX(order_id) FROM order_items) 
                INNER JOIN product ON product.id = order_items.product_id
                INNER JOIN shipping_address on shipping_address.id=order_details.shipping_address_id 
                where customer_id=$1`,
      [body.id]
    );
    res.send(orderList.rows);
  },
  getAllOrders: async (req, res) => {
    const body = req.body;
    const orderList = await client.query(
      `SELECT order_details.subtotal,order_details.status,
      order_details.ordered_on,order_items.product_id,order_items.count,
      product.price,product.name,product.image,shipping_address.address_line,
                shipping_address.city,shipping_address.postal_code,shipping_address.country
                FROM order_details INNER join order_items ON order_items.order_id=order_details.id
                INNER JOIN product ON product.id = order_items.product_id
                INNER JOIN shipping_address on shipping_address.id=order_details.shipping_address_id 
                where customer_id=$1`,
      [body.id]
    );
    res.send(orderList.rows);
  },
};
