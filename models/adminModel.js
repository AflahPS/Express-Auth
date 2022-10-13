const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "An admin must have a name"],
    uppercase: true
  },
  password: {
    type: Number,
    required: [true, "An admin must have a password"],
  },
  email: {
    type: String,
    required: [true, "An admin must have a unique email"],
    unique: true,
    lowercase:true
  },
  post: {
    type: String,
    required: [true, "Admin post should be added"],
  },
  createdAt: {
    type: Date,
    default: ()=> Date.now()
  },
  updatedAt:{
    type: Date,
    default: ()=> Date.now()
  }
});

const Admin = mongoose.model("Admin", adminSchema);

exports.findById = Admin.findById.bind(Admin);

exports.addSaveAdmin = async function (admin) {
  try {
    const newAdmin = await Admin.create(admin);
    return newAdmin;
  } catch (error) {
    console.log("Error while savin admin to database (@adminModel) :" + error.message);
  }
};

exports.findAdminByEmail = async function (email) {
  try {
    const admin = await Admin.findOne({ email: email });
    return admin ? admin : false;
  } catch (error) {
    console.log("Error in finding admin from database (@adminModel) :" + error.message);
  }
};
