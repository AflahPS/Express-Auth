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
  rating: Number
});

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

exports.getAllProducts = async () => await Product.find();


