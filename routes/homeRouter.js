const express = require("express");
const commonController = require("./../controllers/commonControllers");

const router = new express.Router();

const renderHome = (req, res) => {
  message = null;
  commonController.renderer(req, res, "home");
};

router.route("/").get(commonController.redirectLogin, renderHome);

module.exports = router;
