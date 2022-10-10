const commonController = require("./commonControllers");
const Admin = require("./../models/adminModel");
const User = require("./../models/userModel");
const Product = require("./../models/productModel");
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
  try {
    const extst = await Admin.findAdminByEmail(email);
    if (!extst) {
      const admin = {
        name,
        password,
        email,
        post,
      };
      const newAdmin = await Admin.addSaveAdmin(admin);
      console.log(newAdmin);
      req.session.adminID = newAdmin._id;
      return res.redirect("/admin/panel");
    } else {
      productReader.message = "Email already used";
      return commonController.renderer(req, res, "adminRegister");
    }
  } catch (error) {
    console.log(
      "Error while finding/Saving admin (@adminController-validateRegister) :" +
        error
    );
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

exports.AdminValidateUserRegister = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password == confirmPassword && password != "") {
    try {
      const extst = await User.findUserByEmail(email);
      if (!extst) {
        const user = {
          name,
          password,
          email,
        };
        await User.addSaveUser(user);
        productReader.message = "New User has been added Successfully !!";
        return commonController.renderer(req, res, "AP-Users");
      } else {
        productReader.message = "Email already used !!";
        return commonController.renderer(req, res, "AP-Create-User");
      }
    } catch (error) {
      console.log(
        "Error while finding/Saving admin (@adminController-validateUserRegister) :" +
          error.message
      );
    }
  }
  productReader.message = "Re-entered password is wrong !!";
  return commonController.renderer(req, res, "AP-Create-User");
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await User.deleteUserById(id);
    productReader.message = "User has been Deleted Successfully !!";
    return commonController.renderer(req, res, "AP-Users");
  } catch (error) {
    console.log("Error while deletion (@adminController) :" + error);
    productReader.message = "Failed to delete the user, Try again !!";
    return commonController.renderer(req, res, "AP-Users");
  }
};

exports.renderEditUser = (req, res) => {
  exports.editUserId = req.params.id;
  productReader.message = null;
  commonController.renderer(req, res, "AP-Edit-User");
};

exports.editUser = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndUpdate(id, req.body);
    productReader.message = "User has been Edited Successfully !!";
    return commonController.renderer(req, res, "AP-Users");
  } catch (error) {
    console.log("Error while editing (@adminController) :" + error.message);
    productReader.message = "Failed to update the user data !!";
    return commonController.renderer(req, res, "AP-Users");
  }
};

// CRUD Products

exports.renderAdminProducts = (req, res) => {
  productReader.message = null;
  commonController.renderer(req, res, "AP-Products");
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    await Product.deleteProductById(id);
    productReader.message = "Product has been Deleted Successfully !!";
    return commonController.renderer(req, res, "AP-Products");
  } catch (error) {
    console.log("Error while deletion (@adminController) :" + error);
    productReader.message = "Failed to delete the Product !!";
    return commonController.renderer(req, res, "AP-Products");
  }
};

exports.renderProductById = async (req, res) => {
  try {
    productReader.PID = req.params.id;
    const product = await Product.findById(req.params.id);
    if (product) {
      return commonController.renderer(req, res, "AP-Product");
    }
  } catch (error) {
    console.log("Error finding product by ID (@adminController) :" + error);
  }
  productReader.message = "Product not found in the database !";
  return commonController.renderer(req, res, "AP-Products");
};

exports.renderProductSearch = async (req, res) => {
  const { title } = req.body;
  if (title === "" || !title) {
    productReader.message = "Insert a title !!";
    commonController.renderer(req, res, "AP-Products");
  } else {
    const product = await Product.findProductByName(title);
    if (product) {
      productReader.PID = product._id;
      productReader.message = null;
      commonController.renderer(req, res, "AP-product");
    } else {
      productReader.message = "Sorry, product not found !!";
      commonController.renderer(req, res, "AP-Products");
    }
  }
};

exports.renderEditProduct = (req, res) => {
  productReader.PID = req.params.id;
  productReader.message = null;
  commonController.renderer(req, res, "AP-Edit-Product");
};

exports.editProduct = async (req, res) => {
  const id = req.params.id;
  try {
    await Product.findByIdAndUpdate(id, req.body, {
      runValidator: true,
      new: true,
    });
    productReader.message = "Product has been Edited Successfully !!";
    commonController.renderer(req, res, "AP-Products");
  } catch (error) {
    console.log(
      "Error while editing product (@adminController) :" + error.message
    );
    throw error;
  }
};

exports.renderCreateProduct = (req, res) => {
  productReader.message = null;
  commonController.renderer(req, res, "AP-Create-Product");
};

exports.createProduct = async (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  await Product.addSaveProduct(newProduct);
  productReader.message = "Product has been Created Successfully !!";
  commonController.renderer(req, res, "AP-Products");
};
