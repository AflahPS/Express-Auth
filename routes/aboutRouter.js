const express = require('express')
const commonController = require('./../controllers/commonControllers')

const router = new express.Router();


const renderAbout = (req, res) => {
  commonController.renderer(req, res, "about");
}

router.route('/').get(commonController.redirectLogin,renderAbout)

module.exports = router;
