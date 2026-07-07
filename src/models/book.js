const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Book extends Model {}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    publicationYear: {
      type: DataTypes.INTEGER,
      field: 'publication_year',
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Book',
    tableName: 'book',
    timestamps: false,
  }
);

module.exports = Book;
