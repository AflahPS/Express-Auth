const commonController = require("./commonControllers");
const Admin = require("./../models/adminModel");
const User = require("./../models/userModel");
const productReader = require("./productReader");
let userID = null;

// Authentication System

exports.renderSignin = (req, res) => {
  productReader.message = null;
  commonController.renderer(req, res, "adminSignin");
};

exports.renderRegister = (req, res) => {
  productReader.message = null;
  commonController.renderer(req, res, "adminRegister");
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

// Validators

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

// Panel

exports.renderAdminPanel = (req, res) => {
  commonController.renderer(req, res, "adminPanel");
};

// CRUD Users

exports.renderAdminUsers = (req, res) => {
  productReader.message = null;
  commonController.renderer(req, res, "AP-Users");
};

exports.renderUser = async (req, res) => {
  const { name } = req.body;
  if (name === "" || !name) {
    productReader.message = "Insert a name !!";
    commonController.renderer(req, res, "AP-Users");
  } else {
    const user = await User.findUserByName(name);
    if (user) {
      exports.userID = user._id;
      productReader.message = null;
      commonController.renderer(req, res, "AP-User");
    } else {
      productReader.message = "Sorry, User not found !!";
      commonController.renderer(req, res, "AP-Users");
    }
  }
};

exports.renderCreateUser = (req, res) => {
  productReader.message = null;
  commonController.renderer(req, res, "AP-Create-User");
};

exports.AdminValidateRegister = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password === confirmPassword && password !== '') {
    const extst = await User.findUserByEmail(email);
    if (!extst) {
      const user = {
        name,
        password,
        email,
      };
      await User.addSaveUser(user);
      productReader.message = "New User has been added Successfully !!";
      commonController.renderer(req, res, "AP-Users");
    } else {
      productReader.message = "Email already used !!";
      return commonController.renderer(req, res, "AP-Create-User");
    }
  }
  productReader.message = "Re-entered password is wrong !!";
  return commonController.renderer(req, res, "AP-Create-User");
};

exports.deleteUser = async (req, res) =>{
  const id = req.params.id
  User.deleteUserById(id);
  productReader.message = "User has been Deleted Successfully !!";
  commonController.renderer(req, res, "AP-Users");
}

// CRUD Products

exports.renderAdminProducts = (req, res) => {
  productReader.message = null;
  commonController.renderer(req, res, "AP-Products");
};







