'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'stats',
      'bytes',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'stats',
      'bytes',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    );
  }
};
