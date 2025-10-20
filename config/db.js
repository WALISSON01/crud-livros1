const mongoose = require('mongoose');
const conectarDB = async () => {
  try {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    await mongoose.connect(uri);
    console.log('MongoDB conectado com sucesso!');
  } catch (err) {
    console.error('Erro ao conectar MongoDB:', err);
    process.exit(1);
  }
};
module.exports = conectarDB;
