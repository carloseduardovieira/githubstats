'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const updateStats = queryInterface.addColumn(
      'stats',
      'repository_id',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'searches',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'no action',
      }
    );

    return updateStats;
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'stats',
      'repository_id'
    );
  }
};
