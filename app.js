const express = require("express");
const ejs = require("ejs");
const morgan = require("morgan");
const session = require("express-session");

const app = express();
app.set("view engine", "ejs");

// Handlers and functions declarations
function renderer(res, route) {
  const nav = [
    { path: "/home", title: "HOME", style: "/home.css" },
    { path: "/products", title: "PRODUCTS", style: "/products.css" },
    { path: "/signin", title: "SIGN-IN", style: "/signin.css" },
    { path: "/about", title: "ABOUT", style: "/about.css" },
    { path: "/register", title: "REGISTER", style: "/register.css" },
  ];

  const renderObject = {
    style: `/${route}.css`,
    title: `${route[0].toUpperCase() + route.slice(1)}`,
    nav,
    message: "",
  };
  res.render(route, renderObject);
}

// Variable declarations
const hourInMS = 1000 * 60 * 60;
const cookieAge = 2 * hourInMS;
const sessId = "sid";
const nav = [
  { path: "/home", title: "HOME", style: "/home.css" },
  { path: "/products", title: "PRODUCTS", style: "/products.css" },

  { path: "/about", title: "ABOUT", style: "/about.css" },
];

const users = [
  { id: 1, name: "admin", email: "admin@brand.com", password: "123456" },
  { id: 2, name: "boss", email: "boss@brand.com", password: "123456" },
  { id: 3, name: "master", email: "master@brand.com", password: "123456" },
];

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

// Routers

app.get("/", (req, res) => {
  res.status(200);
  const { userID } = req.session;

  if (!userID) {
    renderer(res, "signin");
  } else {
    renderer(res, "home");
  }
});

app.get("/home", redirectLogin, (req, res) => {
  res.status(200);
  renderer(res, "home");
});

app.get("/products", redirectLogin, (req, res) => {
  res.status(200);
  renderer(res, "products");
});

app.get("/about", redirectLogin, (req, res) => {
  res.status(200);
  renderer(res, "about");
});

/*
app.get("/register", (req, res) => {
  res.status(200);
  renderer(res, "register");
});

app.get("/signin", redirectHome, (req, res) => {
  res.status(200);

  renderer(res, "signin");
});
*/

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

app.post("/signin", redirectHome, (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);
  console.log(email, password);
  console.log(users[0].email, users[0].password);

  if (email && password) {
    const user = users.find(
      (el) => el.email === email && el.password === password
    );
    if (user) {
      req.session.userID = user.id;
      console.log("userID =" + req.session.userID);
      return res.redirect("/home");
    }
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

app.use((req, res) => {
  res.status(404);
  renderer(res, "404");
});


const port = 7000;
app.listen(port, () => {
  console.log(`Server is running on ${port} ...`);
});
