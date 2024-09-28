const { Sequelize } = require('sequelize');

// Configura a conexão com o MySQL
const sequelize = new Sequelize('promospedagem', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

// Testa a conexão
sequelize.authenticate()
    .then(() => console.log('Conectado ao banco de dados com sucesso!'))
    .catch(err => console.log('Erro ao conectar ao banco de dados:', err));

module.exports = sequelize;