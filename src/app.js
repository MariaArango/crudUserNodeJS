require('dotenv').config();
const express = require('express');
const { ensureAuth } = require('./middlewares/authenticated');
const { dbConect } = require('./repository');

const app = express();
const port = process.env.PORT;

// manejo de error handling
const errorHandler = (err, req, res) => {
  // eslint-disable-next-line no-console
  console.log(err.msg);
  res.status(401).json({ msg: 'Necesita autenticación' });
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ensureAuth);
dbConect();
// cargar rutas
const userRoutes = require('./routes/user');

// rutas base
app.use('/api', userRoutes);

app.use(errorHandler);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor del API REST  esta funcionando en el puerto ${port}`);
});
