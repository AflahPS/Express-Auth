const User = require("./../models/common");
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

  const message = productReader.message;
  const productsData = productReader.productsData;
  const PID = productReader.PID;
  const user = await User.findById(req.session.userID);
  const renderObject = {
    style: `/${route}.css`,
    title: `${route[0].toUpperCase() + route.slice(1)}`,
    nav,
    PID,
    message,
    user,
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
