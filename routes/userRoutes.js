const express = require("express");
const commonController = require("./../controllers/commonControllers");
const userController = require("./../controllers/userControllers");

const router = new express.Router();

router
  .route("/signin")
  .get(commonController.redirectHome, userController.renderSignin)
  .post(userController.validateSignin);

router
  .route("/register")
  .get(commonController.redirectHome, userController.renderRegister)
  .post(userController.validateRegister);

router.route("/signout").post(userController.signOut);

router.route('/').get(commonController.redirectLogin, userController.renderUserDash)
router.route('/dash').get(commonController.redirectLogin, userController.renderUserDash)


module.exports = router;
