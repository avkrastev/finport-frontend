const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const assetRoutes = require("./routes/asset");
const p2pRoutes = require("./routes/p2p");
const historyRoutes = require("./routes/history");

const checkAuth = require("./middleware/auth");
const cacheProvider = require("./utils/cache-provider");

const app = express();

cacheProvider.start(function (err) {
  if (err) console.error(err);
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

const unless =
  (middleware, ...paths) =>
  (req, res, next) =>
    paths.some((path) => path === req.path)
      ? next()
      : middleware(req, res, next);

app.use(unless(checkAuth, "/api/users/login", "/api/users/signup"));

app.use("/api/users", userRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/p2p", p2pRoutes);
app.use("/api/history", historyRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500).json({
    message: error.message || "An unknown error ocurred!",
  });
});

mongoose
  .connect(
    "mongodb+srv://avkrastev:1q221q22@cluster0.e1w4v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    //"mongodb://localhost:27017/finport"
  )
  .then(() => {
    app.listen(3005);
  })
  .catch((err) => {
    console.log(err);
  });
