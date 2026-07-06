const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publication_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'publication_year' 
    }
}, {
    tableName: 'book', 
    timestamps: false  
});

module.exports = Book;