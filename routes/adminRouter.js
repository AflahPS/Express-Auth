const express = require("express");
const commonController = require("./../controllers/commonControllers");
const adminController = require("./../controllers/adminControllers");

const router = new express.Router();

router
  .route("/signin")
  .get(commonController.redirectPanel, adminController.renderSignin)
  .post(adminController.validateSignin);

router.route("/signout").post(adminController.signOut);

router
  .route("/")
  .get(commonController.redirectAdminLogin, adminController.renderAdminPanel);

router
  .route("/panel")
  .get(commonController.redirectAdminLogin, adminController.renderAdminPanel);

router
  .route("/register")
  .get(commonController.redirectPanel, adminController.renderRegister)
  .post(adminController.validateRegister);

router
  .route("/users")
  .get(commonController.redirectAdminLogin, adminController.renderAdminUsers);

router
  .route("/products")
  .get(commonController.redirectAdminLogin, adminController.renderAdminProducts);

module.exports = router;
