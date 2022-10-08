const fs = require("fs");

exports.PID=null;
exports.message=null;
const productsJson = fs.readFileSync("./JSON/new.json");  
exports.productsData = JSON.parse(productsJson);
