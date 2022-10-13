const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    minLength: 2,
    required: [true, "A user must have a name"],
    uppercase:true
  },
  password: {
    type: Number,
    required: [true, "A user must have a password"],
  },
  email: {
    type: String,
    required: [true, "A user must have a unique email"],
    lowercase: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
    required:true
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
    required:true
  },
});

userSchema.pre('findByIdAndUpdate', function (next){
  this.updatedAt = Date.now();
  next();
})

const User = mongoose.model("User", userSchema);


exports.findById = User.findById.bind(User);
exports.findByIdAndUpdate = User.findByIdAndUpdate.bind(User);

exports.addSaveUser = async function (user) {
  try {
    return await User.create(user);
  } catch (error) {
    console.log("Error while saving new user (@addSaveUser) :" + error.message);
  }
};

exports.findUserByEmail = async function (email) {
  const user = await User.findOne({ email: email });
  if (!user) {
    return false;
  } else if (user.email === email) {
    return user;
  }
};

exports.findUserByName = async function (name) {
  const user = await User.findOne({ name: name });
  if (!user) {
    return false;
  } else {
    return user;
  }
};

exports.getAllUsers = async function () {
  try {
    const users = await User.find({});
    return users;
  } catch (err) {
    console.log(`Error at User.getAllUsers : ${err.message}`);
  }
};

exports.deleteUserById = async function (id) {
  try {
    await User.deleteOne({ _id: id });
  } catch (err) {
    console.log(`Error at User.deleteUser : ${err.message}`);
  }
};



