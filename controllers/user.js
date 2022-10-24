const UserSchema = require("../models/userSchema");
const UserModel = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("../services/jwt");

async function createUser(req, res) {
  const userData = new UserSchema(req.body);
  const { name, lastname, email, password } = req.body;

  try {
    if (!name || name == null || name == undefined) {
      return res.status(400).json({ msg: "el nombre es obligatorio" });
    }
    if (!lastname || lastname == null || lastname == undefined) {
      return res.status(400).json({ msg: "el apellido es obligatorio" });
    }
    if (!email || email == null || email == undefined) {
      return res.status(400).json({ msg: "el email es obligatorio" });
    }
    if (!password || password == null || password == undefined) {
      return res.status(400).json({ msg: "la contraseña es obligatoria" });
    }

    //revisamos que se cumple la clave unica del email
    const foundEmail = await UserSchema.findOne({ email });
    if (foundEmail) throw { msg: "el email ya existe" };

    const salt = bcryptjs.genSaltSync(10);
    userData.password = await bcryptjs.hash(password, salt);
    userData.save();
    const user = new UserModel(userData);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
}

async function getUsers(req, res) {
  try {
    const userData = await UserSchema.find();
    const users = new Array();
    userData.forEach((user) => users.push(new UserModel(user)));

    res.status(200).json(users);
  } catch (error) {
    if (!users) {
      res.status(404).json({ msg: "No hay usuarios" });
    } else {
      res.status(500).json({ msg: error });
    }
  }
}

async function getUserById(req, res) {
  const idUser = req.params.id;

  try {
    const userData = await UserSchema.findById(idUser);
    const user = new UserModel(userData);

    res.status(200).json(user);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed for value")) {
      res.status(404).json({ msg: "No existe el  usuario" });
    } else {
      res.status(500).json({ msg: error });
    }
  }
}

async function updateUser(req, res) {
  const idUser = req.params.id;
  const params = req.body;

  try {
    const userData = await UserSchema.findByIdAndUpdate(idUser, params);
    const user = new UserModel(userData);

    res.status(200).json({ msg: "Usuario actualizado" });
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed for value")) {
      res.status(404).json({ msg: "No existe el  usuario" });
    } else {
      res.status(500).json({ msg: error });
    }
  }
}

async function deleteUser(req, res) {
  const idUser = req.params.id;

  try {
    const user = await UserSchema.findByIdAndDelete(idUser);

    if (!user) {
      res.status(404).json({ msg: "No existe el usuario" });
    } else {
      res.status(204).json({});
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "error en el email o contraseña" });
    }
    const passwordSuccess = await bcryptjs.compare(password, user.password);
    if (!passwordSuccess) {
      return res.status(400).json({ msg: "---error en el email o contraseña" });
    }
    res.status(200).json({ token: jwt.createToken(user, "12h") });
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
};
