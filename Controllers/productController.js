const {createProduct,getProducts,getProductById} = require('../Services/productService');

module.exports={
    createProduct: (req, res) => {
        const body = req.body;
        createProduct(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database Connection Error",
            });
          }
          return res.status(200).json({
            success: 1,
            data: results,
          });
        });
      },
      getProductById: (req, res) => {
        const id = req.params.id;
        console.log(id);
        getProductById(id, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (!results) {
            return res.json({
              success: 0,
              message: "Record Not Found",
            });
          }
          return res.json({
            success: 1,
            data: results,
          });
        });
      },
      getProducts: (req, res) => {
        getProducts((err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          return res.json({
            success: 1,
            data: results,
          });
        });
      },
}