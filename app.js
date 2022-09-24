const express = require("express");
const ejs = require("ejs");
const morgan = require("morgan");
const session = require("express-session");
const fs = require("fs");

const app = express();
app.set("view engine", "ejs");

const productsJson = fs.readFileSync("./JSON/new.json");
const productsData = JSON.parse(productsJson);
let PID = null;
// Database
const users = [
  { id: 1, name: "admin", email: "admin@brand.com", password: "123456" },
  { id: 2, name: "boss", email: "boss@brand.com", password: "123456" },
  { id: 3, name: "master", email: "master@brand.com", password: "123456" },
];

// Handlers and functions declarations
function renderer(req, res, route) {
  const nav = [
    { path: "/home", title: "HOME", style: "/home.css" },
    { path: "/products", title: "PRODUCTS", style: "/products.css" },
    { path: "/about", title: "ABOUT", style: "/about.css" },
  ];

  const renderObject = {
    style: `/${route}.css`,
    title: `${route[0].toUpperCase() + route.slice(1)}`,
    nav,
    PID,
    user: users[req.session.userID - 1],
    productsData,
  };
  res.render(route, renderObject);
}

const redirectLogin = (req, res, next) => {
  if (!req.session.userID) {
    res.redirect("/");
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

app.get("/", (req, res) => {
  res.status(200);
  const { userID } = req.session;

  if (!userID) {
    renderer(req, res, "signin");
  } else {
    renderer(req, res, "home");
  }
});

app.get("/home", redirectLogin, (req, res) => {
  cacheClear(res);
  res.status(200);
  renderer(req, res, "home");
});

app.get("/products", redirectLogin, (req, res) => {
  cacheClear(res);
  res.status(200);
  renderer(req, res, "products");
});

app.get("/about", redirectLogin, (req, res) => {
  cacheClear(res);
  res.status(200);
  renderer(req, res, "about");
});

app.get("/product/:id", redirectLogin, (req, res) => {
  cacheClear(res);
  res.status(200);
  PID = req.params.id * 1;
  const product = productsData.products.find((el) => el.id === PID);
  if (product) {
    return renderer(req, res, "product");
  }
  res.redirect("/home");
});

// Routers-Posters

app.post("/signin", redirectHome, (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const user = users.find(
      (el) => el.email === email && el.password === password
    );
    if (user) {
      req.session.userID = user.id;
      return res.redirect("/home");
    }
  }

  res.redirect("/");
});

app.post("/register", redirectHome, (req, res) => {
  const { name, email, password } = req.body;

  const exist = users.some((el) => {
    el.email === email;
  });

  if (!exist) {
    const user = {
      id: users.length + 1,
      name,
      password,
      email,
    };
    users.push(user);

    req.session.userID = user.id;
    return res.redirect("/home");
  }

  res.redirect("/");
});

app.post("/signout", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/home");
    }
    res.clearCookie("sid");
    res.redirect("/");
  });
});

// 404-Error

app.use((req, res) => {
  res.status(404);
  renderer(req, res, "404");
});

// Listener

const port = 7000;
app.listen(port, () => {
  console.log(`Server is running on ${port} ...`);
});
