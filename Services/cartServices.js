const client = require("../config/dbconfig");

module.exports = {
  createCart: (data, callback) => {
    client.query(
      `INSERT INTO cart_item(customer_id,product_id,quantity) VALUES ($1,$2,$3)`,
      [data.customer_id, data.product_id, data.quantity],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results.rows);
      }
    );
  },
  getCart: (callBack) => {
    client.query(
      `SELECT id,customer_id,product_id,quantity from cart_item`,
      [],
      (err, result) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, result.rows);
      }
    );
  },
  updateCart: (callBack) => {
    client.query(
      `SELECT id,product_id from cart_item`,[],
      (err, result) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, result.rows);
      }
    );
  },
};
