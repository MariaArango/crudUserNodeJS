const bcryptjs = require('bcryptjs');
const UserSchema = require('../models/userSchema');
const UserModel = require('../models/User');
const jwt = require('../services/jwt');

function createUser(req, res) {
  const { name, lastname, email, password } = req.body;
  if (!name || name == null || name === undefined) {
    return res.status(400).json({ msg: 'el nombre es obligatorio' });
  }
  if (!lastname || lastname == null || lastname === undefined) {
    return res.status(400).json({ msg: 'el apellido es obligatorio' });
  }
  if (!email || email == null || email === undefined) {
    return res.status(400).json({ msg: 'el email es obligatorio' });
  }
  if (!password || password == null || password === undefined) {
    return res.status(400).json({ msg: 'la contraseña es obligatoria' });
  }
  const userData = new UserSchema(req.body);

  UserSchema.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ msg: 'el email ya existe' });
      }

      bcryptjs
        .hash(password, bcryptjs.genSaltSync(10))
        .then((pwd) => {
          userData.password = pwd;
          userData.save();

          return res.status(200).json(new UserModel(userData));
        })
        .catch((error) => {
          return res.status(500).json({ msg: error });
        });
    })
    .catch((error) => {
      return res.status(500).json({ msg: error });
    });
}

function getUsers(req, res) {
  UserSchema.find()
    .then((userData) => {
      return res.status(200).json(userData.map((user) => new UserModel(user)));
    })
    .catch((error) => {
      return res.status(500).json({ msg: error });
    });
}

function getUserById(req, res) {
  const idUser = req.params.id;
  UserSchema.findById(idUser)
    .then((user) => {
      return res.status(200).json(new UserModel(user));
    })
    .catch((error) => {
      if (error.message.includes('Cast to ObjectId failed for value')) {
        return res.status(404).json({ msg: 'No existe el  usuario' });
      } else {
        return res.status(500).json({ msg: error });
      }
    });
}

function updateUser(req, res) {
  const idUser = req.params.id;
  const params = req.body;

  UserSchema.findByIdAndUpdate(idUser, params)
    .then((user) => {
      return res.status(200).json(new UserModel(user));
    })
    .catch((error) => {
      if (error.message.includes('Cast to ObjectId failed for value')) {
        return res.status(404).json({ msg: 'No existe el usuario' });
      } else {
        return res.status(500).json({ msg: error });
      }
    });
}

function deleteUser(req, res) {
  const idUser = req.params.id;

  UserSchema.findByIdAndDelete(idUser)
    .then(() => {
      return res.status(204).json({});
    })
    .catch(() => {
      return res.status(204).json({});
    });
}

function login(req, res) {
  const { email, password } = req.body;

  if (!email || email == null || email === undefined) {
    return res.status(400).json({ msg: 'el email es obligatorio' });
  }
  if (!password || password == null || password === undefined) {
    return res.status(400).json({ msg: 'la contraseña es obligatoria' });
  }

  UserSchema.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).json({ msg: 'error en el email o contraseña' });
    }
    bcryptjs
      .compare(password, user.password)
      .then((passwordSuccess) => {
        if (!passwordSuccess) {
          return res
            .status(400)
            .json({ msg: 'error en el email o contraseña' });
        }
        return res.status(200).json({ token: jwt.createToken(user, '12h') });
      })
      .catch((error) => {
        return res.status(500).json({ error });
      });
  });
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
};
