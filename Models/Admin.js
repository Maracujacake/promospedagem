const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Admin = sequelize.define('admin', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    senha:{
        type: DataTypes.STRING,
        allowNull: false
    }
});