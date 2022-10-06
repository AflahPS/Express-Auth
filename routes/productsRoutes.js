const express = require("express");
const productControllers = require("./../controllers/productsControllers");
const commonController = require("./../controllers/commonControllers");

const router = new express.Router();

router
  .route("/")
  .get(commonController.redirectLogin, productControllers.renderAllProducts);
router
  .route("/:id")
  .get(commonController.redirectLogin, productControllers.renderProductsById);

module.exports = router;
