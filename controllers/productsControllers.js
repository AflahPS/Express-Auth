const commonController = require("./commonControllers");
const productReader = require("./productReader");


exports.renderAllProducts = (req, res) => {
  commonController.renderer(req, res, "products");
};

exports.renderProductsById = (req, res) => {
  productReader.PID = req.params.id * 1;
  const product = productReader.productsData.products.find((el) => el.id === productReader.PID);
  if (product) {
    return commonController.renderer(req, res, "product");
  }
  productReader.message = "Product not found in the database !";
  res.redirect("/404");
};

