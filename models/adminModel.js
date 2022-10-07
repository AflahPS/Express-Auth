const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "An admin must have a name"],
  },
  password: {
    type: Number,
    required: [true, "An admin must have a password"],
  },
  email: {
    type: String,
    required: [true, "An admin must have a unique email"],
    unique: true,
  },
  post: {
    type: String,
    required: [true, "Admin post should be added"]
  }
});

const Admin = mongoose.model("Admin", adminSchema);

exports.findById = Admin.findById.bind(Admin)

exports.addSaveAdmin = async function (admin) {
  const test = new Admin(admin);
  await test
    .save()
    .then((doc) => {
      console.log("Added successfully: "+ doc);
    })
    .catch((err) => console.log("Error :" + err));
};

exports.findAdminByEmail = async function (email) {
  const admin = await Admin.findOne({ email: email });
  if (!admin) {
    return false;
  } else if (admin.email === email) {
    return admin;
  }
};
