const express = require("express");
const ejs = require("ejs");
const morgan = require("morgan");
const session = require("express-session");
const mongoose = require("mongoose");

// Routers

const productsRouter = require("./routes/productsRoutes");
const homeRouter = require("./routes/homeRouter");
const aboutRouter = require("./routes/aboutRouter");
const userRouter = require("./routes/userRoutes");
const adminRouter = require('./routes/adminRouter')
const commonController = require("./controllers/commonControllers");

// APP and ENGINE

const app = express();
app.set("view engine", "ejs");

// DATABASE

const DB = "mongodb://localhost:27017/first-express";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("Successfully connected to MongoDB");
  });

// Variable declarations

const hourInMS = 1000 * 60 * 60;
const cookieAge = 2 * hourInMS;
const sessId = "sid";

// Middlewares

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(
  session({
    name: sessId,
    resave: false,
    saveUninitialized: false,
    secret: "Take*Some-Rest",
    cookie: {
      maxAge: cookieAge,
      sameSite: true,
    },
  })
);
app.use(express.static(__dirname + "/public"));

// Routes

app.use("/home", homeRouter);
app.use("/", homeRouter);
app.use("/about", aboutRouter);
app.use("/products", productsRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

// 404-Error

app.use((req, res) => {
  commonController.renderer(req, res, "404");
});

// Listener

const port = 7000;
app.listen(port, () => {
  console.log(`Server is running on ${port} ...`);
});
