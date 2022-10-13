const fs = require("fs");
const mongoose = require("mongoose");

const DB = "mongodb://localhost:27017/first-express";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("Successfully connected to MongoDB");
  });

const productSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Product must have a name"] },
  price: { type: Number, requied: [true, "Product price missing"] },
  stock: { type: Number },
  brand: { type: String, requied: [true, "Product brand missing"] },
  description: { type: String, requied: [true, "Product description missing"] },
  thumbnail: { type: String, requied: [true, "Product image links missing"] },
  discountPercentage: Number,
  category: String,
  images: [String],
  rating: Number,
});

const Product = mongoose.model("Product", productSchema);
const addSaveProduct = async function (product) {
  const test = new Product(product);
  await test
    .save()
    .then((doc) => {
      return doc;
    })
    .catch((err) => console.log("Error :" + err));
};

const productsJson = JSON.parse(fs.readFileSync("./new.json"));
const { products } = productsJson;
products.map( async el=>{
  await addSaveProduct(el)
})
console.log("Successful Transfer");
