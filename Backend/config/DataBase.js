const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

mongoose.connect(process.env.URL_MONGODB)
    .then(() => console.log('Conectado com sucesso ao banco de dados!'))
    .catch((erro) => console.error('Erro ao conectar ao Banco de Dados: ', erro));

module.exports = mongoose;