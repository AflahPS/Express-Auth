const commonController = require("./commonControllers");
const productReader = require("./productReader");
const productModel = require('./../models/productModel')


exports.renderAllProducts = (req, res) => {
  commonController.renderer(req, res, "products");
};

exports.renderProductsById = async (req, res) => {
  try {
    productReader.PID = req.params.id;
    const product = await productModel.findById(req.params.id)
    if(product){
      return commonController.renderer(req, res, "product")
    }
  } catch (error) {
    console.log("Error finding product by ID (@productsController) :"+ error);
  }
  productReader.message = "Product not found in the database !";
  res.redirect("/404");
};





