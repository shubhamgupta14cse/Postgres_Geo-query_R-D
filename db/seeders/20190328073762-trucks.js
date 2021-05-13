'use strict';
const input = require("./input.json");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('trucks', JSON.parse(JSON.stringify(input)), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('trucks', null, {});
  }
};
