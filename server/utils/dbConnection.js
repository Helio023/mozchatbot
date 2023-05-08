const mongoose = require('mongoose');

const dbUrl = process.env.DB_URL;
exports.connectDb = async () => {
  return mongoose
    .connect(dbUrl, {
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Base de dados conectada com sucesso');
    })
    .catch((e) => {
      console.log(`Erro ao conectar a base de dados👋 : ${e}`);
    });
};
