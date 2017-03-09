'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Tournaments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      score: {
        type: Sequelize.STRING,
        allowNull: true
      },
      school: {
        type: Sequelize.STRING
      }
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Tournaments')
  }
}
