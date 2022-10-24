const express = require("express");
const { ensureAuth } = require("./middlewares/authenticated");
const app = express();

//manejo de error handling
const errorHandler = (err, req, res, next) => {
  console.log(err.msg);
  res.status(401).json({ msg: "Necesita autenticación" });
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ensureAuth);

//cargar rutas
const user_routes = require("./routes/user");

//rutas base
app.use("/api", user_routes);

app.use(errorHandler);

module.exports = app;
