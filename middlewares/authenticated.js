const moment = require("moment");
const jwt = require("../services/jwt");

const SECRET_KEY = "H98DFADmdfadfe8987";
const whiteList = ["/api/login", "/api/createUser"];

function ensureAuth(req, res, next) {
  if (!whiteList.includes(req.originalUrl)) {
    if (!req.headers.authorization) {
      return res
        .estatus(401)
        .json({ msg: "la petición no tiene cabecera de Autenticación" });
    }

    const token = req.headers.authorization.replace(/['"]+/g, "");
    const payload = jwt.decodeToken(token, SECRET_KEY);

    try {
      if (payload.exp <= moment().unix()) {
        return res.status(400).json({ msg: "token expirado" });
      }
    } catch (error) {
      return res.status(400).json({ msg: "token invalido" });
    }

    req.user = payload;
  }
  next();
}

module.exports = {
  ensureAuth,
};
