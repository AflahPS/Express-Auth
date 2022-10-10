const User = require("../models/userModel");
const Admin = require("./../models/adminModel");
const Product = require("./../models/productModel");
const productReader = require("./productReader");
const adminController = require("./adminControllers");

const cacheClear = (res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
};

exports.renderer = async function (req, res, route) {

  // Data for user Nav-bar

  const nav = [
    { path: "/home", title: "HOME", style: "/home.css" },
    { path: "/products", title: "PRODUCTS", style: "/products.css" },
    { path: "/about", title: "ABOUT", style: "/about.css" },
  ];
  
  let user, admin, editUser;

  // Getting user/admin data for user pages
  
  let users = await User.getAllUsers();
  if (req.session?.userID) {
    user = users.find((el) => el._id == req.session.userID);
  } else if (adminController?.userID) {
    user = await User.findById(adminController.userID);
  } else if (req.session?.adminID) {
    user = await Admin.findById(req.session.adminID);
  }

  // Getting products data for product pages

  let products = await Product.getAllProducts();
  let product = productReader.PID ? products.find(el=> el._id == productReader.PID) : null;


  // Getting admin data for admin pages

  if (req.session?.adminID) {
    admin = await Admin.findById(req.session.adminID);
  }

  // Getting user data for admin-edit-user page

  if (adminController?.editUserId) {
    editUser = await User.findById(adminController.editUserId);
  }

  // Special acknowledgemnt messsage for several pages

  let message = productReader.message;

  // OBJECT to dynamically inject datas to the HTML document

  const renderObject = {
    style: `/${route}.css`,
    title: firstLetterUpper(route),
    nav,
    message,
    user,
    users,
    admin,
    product,
    products,
    editUser,
  };

  cacheClear(res);
  res.render(route, renderObject);
};

function firstLetterUpper(word){
  return `${word[0].toUpperCase() + word.slice(1)}`
}

exports.redirectLogin = (req, res, next) => {
  if (!req.session.userID && !req.session.adminID) {
    res.redirect("/user/signin");
  } else {
    next();
  }
};

exports.redirectHome = (req, res, next) => {
  if (req.session.userID || req.session.adminID) {
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
