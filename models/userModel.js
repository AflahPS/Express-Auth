const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  password: {
    type: Number,
    required: [true, "A user must have a password"],
  },
  email: {
    type: String,
    required: [true, "A user must have a unique email"],
    unique: true,
  },
});

const User = mongoose.model("User", userSchema);

exports.findById = User.findById.bind(User);

exports.addSaveUser = async function (user) {
  const testUser = new User(user);
  await testUser
    .save()
    .then((doc) => {
      return doc;
    })
    .catch((err) => console.log("Error :" + err));
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
    console.log(`Error at User.getAllUsers : ${err}`);
  }
};

exports.deleteUserById = async function(id){
  try{
    await User.deleteOne({_id: id})
  } catch(err){
    console.log(`Error at User.deleteUser : ${err}`);
  }
}
