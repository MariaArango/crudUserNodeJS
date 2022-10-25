require('dotenv').config();
const mongoose = require('mongoose');

function dbConect() {
  const urlMongoDb = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

  mongoose.connect(urlMongoDb, (err) => {
    try {
      if (err) {
        throw err;
      } else {
        // eslint-disable-next-line no-console
        console.log('La conexión a la base de datos es correcta');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });
}

module.exports = {
  dbConect,
};
