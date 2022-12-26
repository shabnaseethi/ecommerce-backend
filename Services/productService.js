const client = require("../config/dbconfig");

module.exports = {
  createProduct: (data, callback) => {
    client.query(
      `INSERT INTO product(name,price,description,image,review) VALUES ($1,$2,$3,$4,$5)`,
      [data.name, data.price, data.description, data.image,data.review],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results.rows);
      }
    );
  },
  getProducts: (callBack) => {
    client.query(
      `SELECT id,name,price,description,image,review from product`,
      [],
      (err, result) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, result.rows);
      }
    );
  },
  getProductById: (id, callBack) => {
    client.query(
      `SELECT id,name,price,description,image,review from product where id = $1`,
      [id],
      (err, result) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, result.rows);
      }
    );
  },
};
