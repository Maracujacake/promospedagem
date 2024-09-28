const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Promocao = require('./Promocao');

const Hotel = sequelize.define('hotel', {

    cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Hotel;