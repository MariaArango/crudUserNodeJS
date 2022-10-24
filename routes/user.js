const express = require("express");
const Usercontroller = require("../controllers/user");

const api = express.Router();

api.post("/createUser", Usercontroller.createUser);
api.get("/users", Usercontroller.getUsers);
api.get("/user/:id", Usercontroller.getUserById);
api.put("/updateUser/:id", Usercontroller.updateUser);
api.delete("/deleteUser/:id", Usercontroller.deleteUser);
api.post("/login", Usercontroller.login);

module.exports = api;
