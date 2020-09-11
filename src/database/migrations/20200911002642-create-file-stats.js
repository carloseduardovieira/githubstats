'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('stats', {
      id: {
        type:           Sequelize.INTEGER,
        primaryKey:     true,
        autoIncrement:  true,
        allowNull:      false,
      },
      name: {
        type:       Sequelize.STRING,
        allowNull:  false,
      },
      extension: {
        type:       Sequelize.STRING,
        allowNull:  false,
      },
      lines: {
        type:       Sequelize.INTEGER,
        allowNull:  false,
      },
      bytes: {
        type:       Sequelize.INTEGER,
        allowNull:  false,
      },
      created_at: {
        type:       Sequelize.DATE,
        allowNull:  false,
      },
      updated_at: {
        type:       Sequelize.DATE,
        allowNull:  false,
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('stats');
  }
};
