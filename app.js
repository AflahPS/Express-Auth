const express = require("express");
const ejs = require("ejs");
const morgan = require("morgan");
const session = require("express-session");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

const productsJson = fs.readFileSync("./JSON/new.json");
const productsData = JSON.parse(productsJson);
let PID = null;
let message = null;

// Database

const DB = "mongodb://localhost:27017/first-express";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("Successfully connected to MongoDB");
  });

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

async function addSaveUser(user) {
  const testUser = new User(user);
  await testUser
    .save()
    .then((doc) => {
      console.log(doc);
    })
    .catch((err) => console.log("Error :" + err));
}

async function findUserByEmail(email) {
  const user = await User.findOne({ email : email });
  if (!user) {
    return false;

  } else if (user.email===email) {
    return user;
  }
}

async function findUserById(id) {
  const user = await User.findOne({ id : id });
  if (!user) {
    return false;
  } else {
    return user._id;
  }
}

// Handlers and functions declarations
async function renderer(req, res, route) {
  const nav = [
    { path: "/home", title: "HOME", style: "/home.css" },
    { path: "/products", title: "PRODUCTS", style: "/products.css" },
    { path: "/about", title: "ABOUT", style: "/about.css" },
  ];

  const user = await User.findById(req.session.userID)
  const renderObject = {
    style: `/${route}.css`,
    title: `${route[0].toUpperCase() + route.slice(1)}`,
    nav,
    PID,
    message,
    user,
    productsData,
  };
  cacheClear(res);
  res.render(route, renderObject);
}

const redirectLogin = (req, res, next) => {
  if (!req.session.userID) {
    res.redirect("/signin");
  } else {
    next();
  }
};

const redirectHome = (req, res, next) => {
  if (req.session.userID) {
    res.redirect("/home");
  } else {
    next();
  }
};

const cacheClear = (res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
};

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

// Routers-Getters

app.get("/signin", (req, res) => {

  const { userID } = req.session;
  if (!userID) {
    renderer(req, res, "signin");
  } else {
    renderer(req, res, "home");
  }
  
});
app.get("/register", (req, res) => {
  const { userID } = req.session;
  if (!userID) {
    renderer(req, res, "register");
  } else {
    renderer(req, res, "home");
  }
});

app.get("/home", redirectLogin,(req, res) => {
  message = null;
  renderer(req, res, "home");
});

app.get("/products", redirectLogin, (req, res) => {
  renderer(req, res, "products");
});

app.get("/about", redirectLogin, (req, res) => {
  renderer(req, res, "about");
});

app.get("/product/:id", redirectLogin, (req, res) => {
  PID = req.params.id * 1;
  const product = productsData.products.find((el) => el.id === PID);
  if (product) {
    return renderer(req, res, "product");
  }
  message = "Product not found in the database !";
  res.redirect("/404");
});

// Routers-Posters

app.post("/signin", redirectHome,async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const user = await findUserByEmail(email);
    if (user) {
      req.session.userID = user._id;
      return res.redirect("/home");
    }
  }
  message = "Wrong Email/Password !";
  res.redirect("/signin");
});

app.post("/register", redirectHome,async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password === confirmPassword) {
    const extst = await findUserByEmail(email);
    if (!extst) {
      const user = {
        name,
        password,
        email,
      };
      addSaveUser(user);
      const newUser = await findUserByEmail(email)
      req.session.userID = newUser._id;
      return res.redirect("/home");
    } else {
      message = "Email already used !!";
      console.log("Email already used !!");
      return res.redirect("/register");
    }
  }
  message = "Re-entered password is wrong !!";
  return res.redirect("/register");
});


app.post("/signout", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/home");
    }
    res.clearCookie("sid");
    res.redirect("/signin");
  });
});

// 404-Error

app.use((req, res) => {
  renderer(req, res, "404");
});

// Listener

const port = 7000;
app.listen(port, () => {
  console.log(`Server is running on ${port} ...`);
});
