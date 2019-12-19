'use strict';
module.exports = (sequelize, DataTypes) => {
  const Superhero = sequelize.define('Superhero', {
    nickname: DataTypes.STRING,
    real_name: DataTypes.STRING,
    origin_description: DataTypes.TEXT,
    superpowers: DataTypes.TEXT,
    catch_phrase: DataTypes.TEXT,
    images: DataTypes.ARRAY(DataTypes.TEXT)
  }, {
    timestamps: false
  });
  Superhero.associate = function(models) {
    // associations can be defined here
  };
  return Superhero;
};