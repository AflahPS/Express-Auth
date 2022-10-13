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
  .route("/register")
  .get(commonController.redirectPanel, adminController.renderRegister)
  .post(adminController.validateRegister);

// Panel

router
  .route("/")
  .get(commonController.redirectAdminLogin, adminController.renderAdminPanel);

router
  .route("/panel")
  .get(commonController.redirectAdminLogin, adminController.renderAdminPanel);

// CRUD on Users

router
  .route("/users")
  .get(commonController.redirectAdminLogin, adminController.renderAdminUsers);

router
  .route("/user")
  .get(commonController.redirectAdminLogin, adminController.renderUser);

router
  .route("/users/search")
  .post(commonController.redirectAdminLogin, adminController.renderUser);

router
  .route("/create-user")
  .get(commonController.redirectAdminLogin, adminController.renderCreateUser)
  .post(
    commonController.redirectAdminLogin,
    adminController.AdminValidateUserRegister
  );

router
  .route("/delete-user/:id")
  .get(commonController.redirectAdminLogin, adminController.deleteUser);

router
  .route("/edit-user/:id")
  .get(commonController.redirectAdminLogin, adminController.renderEditUser)
  .post(commonController.redirectAdminLogin, adminController.editUser);

// CRUD on Products

router
  .route("/products")
  .get(
    commonController.redirectAdminLogin,
    adminController.renderAdminProducts
  );

router
  .route("/product/:id")
  .get(commonController.redirectAdminLogin, adminController.renderProductById);

router
  .route("/products/search")
  .post(
    commonController.redirectAdminLogin,
    adminController.renderProductSearch
  );

router
  .route("/delete-product/:id")
  .get(commonController.redirectAdminLogin, adminController.deleteProduct);

router
  .route("/edit-product/:id")
  .get(commonController.redirectAdminLogin, adminController.renderEditProduct)
  .post(commonController.redirectAdminLogin, adminController.editProduct);

router
  .route("/create-product")
  .get(commonController.redirectAdminLogin, adminController.renderCreateProduct)
  .post(commonController.redirectAdminLogin, adminController.createProduct);

module.exports = router;
