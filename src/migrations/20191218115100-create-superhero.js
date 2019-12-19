'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Superheros', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nickname: {
        type: Sequelize.STRING
      },
      real_name: {
        type: Sequelize.STRING
      },
      origin_description: {
        type: Sequelize.TEXT
      },
      superpowers: {
        type: Sequelize.TEXT
      },
      catch_phrase: {
        type: Sequelize.TEXT
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Superheros');
  }
};