'use strict';
module.exports = function(sequelize, DataTypes) {
  var Tournament = sequelize.define('Tournament', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Tournament;
};