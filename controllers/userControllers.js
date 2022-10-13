const commonController = require("./commonControllers");
const productReader = require("./productReader");
const User = require("../models/userModel");

exports.renderSignin = (req, res) => {
  productReader.message=null;
  commonController.renderer(req, res, "signin");
};

exports.renderRegister = (req, res) => {
  const { userID } = req.session;
  if (!userID) {
    commonController.renderer(req, res, "register");
  } else {
    commonController.renderer(req, res, "home");
  }
};

exports.validateSignin = async (req, res) => {
  const { email, password } = req.body;
  if (email !== '' && password !== '' ) {
    const user = await User.findUserByEmail(email);
    if(user){
      if (user.password === Number(password)) {
        req.session.userID = user._id;
        return res.redirect("/home");
      }
      productReader.message = "Wrong Password !";
      return commonController.renderer(req, res, "signin");
    }
    productReader.message = "Wrong Email/Password !! , NB: Email is case sensitive";
    return commonController.renderer(req, res, "signin");
  }
  productReader.message = "Please enter both Email and Password !";
  return commonController.renderer(req, res, "signin");
};

exports.validateRegister = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password === confirmPassword && password !== '') {
    const extst = await User.findUserByEmail(email);
    if (!extst) {
      const user = {
        name,
        password,
        email,
      };
      const newUser = await User.addSaveUser(user);
      req.session.userID = newUser._id;
      return res.redirect("/home");
    } else {
      productReader.message = "Email already used !!";
      return res.redirect("/user/register");
    }
  }
  productReader.message = "Re-entered password is wrong !!";
  return res.redirect("/user/register");
};

exports.signOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/home");
    }
    res.clearCookie("sid");
    res.redirect("/user/signin");
  });
};

exports.renderUserDash = (req, res) => {
  commonController.renderer(req, res, "userDash");
};


