const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Promocao = require('./Promocao');

const SiteReserva = sequelize.define('site_reserva', {
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    senha:{
        type: DataTypes.STRING,
        allowNull: false
    },
    nomeSite:{
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    urlSite:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    
});

module.exports = SiteReserva;