/*
 * @Author: hongfu
 * @Date: 2022-02-16 13:55:06
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-16 14:57:48
 * @Description: About file
 */
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nick_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    real_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
