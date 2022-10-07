const commonController = require("./commonControllers");
const Admin = require("./../models/adminModel");
const productReader = require("./productReader");

exports.renderSignin = (req, res) => {
  productReader.message = null;
  commonController.renderer(req, res, "adminSignin");
};

exports.renderRegister = (req, res) => {
  productReader.message = null;
  commonController.renderer(req, res, "adminRegister");
};

exports.renderAdminUsers = (req, res) => {
  productReader.message = null;
  commonController.renderer(req, res, "AP-Users");
};

exports.renderAdminProducts = (req, res) => {
  productReader.message = null;
  commonController.renderer(req, res, "AP-Products");
};


exports.validateSignin = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const admin = await Admin.findAdminByEmail(email);
    if (admin.password === Number(password)) {
      req.session.adminID = admin._id;
      return res.redirect("/admin/panel");
    }
  }
  productReader.message = "Wrong Email/Password !";
  commonController.renderer(req, res, "adminSignin");
};

exports.validateRegister = async (req, res) => {
  const { name, email, password, confirmPassword, specialKey, post } = req.body;

  if (password !== confirmPassword) {
    productReader.message = "Re-entered password is wrong !!";
    return commonController.renderer(req, res, "adminRegister");
  }
  if (specialKey !== "!@#$%") {
    productReader.message = "Special key mismatch !!";
    return commonController.renderer(req, res, "adminRegister");
  }

  const extst = await Admin.findAdminByEmail(email);
  if (!extst) {
    const admin = {
      name,
      password,
      email,
      post,
    };
    await Admin.addSaveAdmin(admin);
    const newAdmin = await Admin.findAdminByEmail(email);
    console.log(newAdmin);
    req.session.adminID = newAdmin._id;
    return res.redirect("/admin/panel");
  } else {
    productReader.message = "Email already used";
    return commonController.renderer(req, res, "adminRegister");
  }
};

exports.signOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/admin/panel");
    }
    res.clearCookie("sid");
    productReader.message = "Signed Out Successfully !!";
    commonController.renderer(req, res, "adminSignin");
  });
};

exports.renderAdminPanel = (req, res) => {
  commonController.renderer(req, res, "adminPanel");
};
