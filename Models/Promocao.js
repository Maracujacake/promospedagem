const {DataTypes} = require('sequelize');
const sequelize = require('../database');
const SiteReserva = require('./SiteReserva');
const Hotel = require('./Hotel');

const Promocao = sequelize.define('promocao', {
    id_promocao:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    preco:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    data_inicio:{
        type: DataTypes.DATE,
        allowNull: false
    },
    data_fim:{
        type: DataTypes.DATE,
        allowNull: false
    },
    hotelCnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'hotels', // Nome da tabela associada
            key: 'cnpj'     // Chave primária da tabela 'hotels'
        }
    },
    siteReservaEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'site_reservas', // Nome da tabela associada
            key: 'email'            // Chave primária da tabela 'site_reservas'
        }
    }
},
{
    freezeTableName: true
    
});

module.exports = Promocao;