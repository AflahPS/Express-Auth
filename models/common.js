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

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  in_stock: Boolean,
  brand: String,
  description: String,
  images: String,
  gender: String
})

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);

exports.findById = User.findById.bind(User)

exports.addSaveUser = async function (user) {
  const testUser = new User(user);
  await testUser
    .save()
    .then((doc) => {
      console.log(doc);
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
