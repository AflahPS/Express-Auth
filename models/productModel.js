const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Product must have a title"] },
  price: { type: Number, requied: [true, "Product price missing"] },
  stock: { type: Number, requied: [true, "Product stock missing"] },
  brand: { type: String, requied: [true, "Product brand missing"] },
  description: { type: String, requied: [true, "Product description missing"] },
  thumbnail: { type: String, requied: [true, "Product image links missing"] },
  discountPercentage: Number,
  category: { type: String, required: [true, "Product must have a name"] },
  images: [String],
  rating: Number,
  createdAt: {
    type: Date,
    default: ()=> Date.now()
  },
  updatedAt:{
    type: Date,
    default: ()=> Date.now()
  }
});

const Product = mongoose.model("Product", productSchema);

exports.findById = Product.findById.bind(Product)
exports.findByIdAndUpdate = Product.findByIdAndUpdate.bind(Product);

exports.addSaveProduct = async function (product) {
  try {
    const test =await Product.create(product);
    console.log(test);
    return test;
  } catch (error) {
    console.log("Error Saving new Product :"+ error.message);
  }
   
};

exports.findProductByName = async function (name) {
  const test = await Product.findOne({ name: name });
  if (!test) {
    return false;
  } else if (test.name === name) {
    return test;
  }
};

exports.getAllProducts = async () => await Product.find();

exports.deleteProductById = async function (id) {
  try {
    await Product.deleteOne({ _id: id });
  } catch (err) {
    console.log(`Error at Product.deleteUser : ${err.message}`);
  }
};
