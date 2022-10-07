const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  name: {type: String,
  required:[true, "Product must have a name"]},
  price: {type: Number,
  requied:[true, "Product price missing"]},
  in_stock:{type: Boolean},
  brand: {type: String,
    requied:[true, "Product brand missing"]},
  description: {type: String,
    requied:[true, "Product description missing"]},
  images: {type: String,
    requied:[true, "Product image links missing"]},
  gender: String
})

const Product = mongoose.model("Product", productSchema);

exports.findById = Product.findById.bind(Product)

exports.addSaveProduct = async function (product) {
  const test = new Product(product);
  await test
    .save()
    .then((doc) => {
      return doc;
    })
    .catch((err) => console.log("Error :" + err));
};

exports.findProductByName = async function (name) {
  const test = await Product.findOne({ name: name });
  if (!test) {
    return false;
  } else if (test.name === name) {
    return test;
  }
};

exports.findAllProducts = async () => await Product.find();


