const User = require("../models/userModel");
const Admin = require("./../models/adminModel");
const productReader = require("./productReader");

let message = null;

const cacheClear = (res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
};

exports.renderer = async function (req, res, route) {
  const nav = [
    { path: "/home", title: "HOME", style: "/home.css" },
    { path: "/products", title: "PRODUCTS", style: "/products.css" },
    { path: "/about", title: "ABOUT", style: "/about.css" },
  ];

  const productsData = productReader.productsData;
  const message = productReader.message;
  const PID = productReader.PID;

  let user, admin;
  if (req.session?.userID) {
    user = await User.findById(req.session.userID);
  } else if (req.session?.adminID) {
    admin = await Admin.findById(req.session.adminID);
  }

  let users = await User.getAllUsers();

  const renderObject = {
    style: `/${route}.css`,
    title: `${route[0].toUpperCase() + route.slice(1)}`,
    nav,
    PID,
    message,
    user,
    users,
    admin,
    productsData,
  };
  cacheClear(res);
  res.render(route, renderObject);
};

exports.redirectLogin = (req, res, next) => {
  if (!req.session.userID) {
    res.redirect("/user/signin");
  } else {
    next();
  }
};

exports.redirectHome = (req, res, next) => {
  if (req.session.userID) {
    res.redirect("/home");
  } else {
    next();
  }
};

exports.redirectPanel = (req, res, next) => {
  if (req.session.adminID) {
    res.redirect("/admin/panel");
  } else {
    next();
  }
};

exports.redirectAdminLogin = (req, res, next) => {
  if (!req.session.adminID) {
    res.redirect("/admin/signin");
  } else {
    next();
  }
};
