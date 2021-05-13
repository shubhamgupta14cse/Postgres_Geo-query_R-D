const fs = require('fs');
const exec = require('child_process').exec;

const config = require('../../config/database.json')
const dbConfig = config[process.env.NODE_ENV]

module.exports = {
  up: function(queryInterface, Sequelize) {
    return new Promise((resolve, reject) => {
      exec(`PGPASSWORD=${dbConfig.password} psql -U ${dbConfig.username} -h ${dbConfig.host} -d ${dbConfig.database} -f ${__dirname}/../SQLScripts/initial_db.sql`, (error, _stdout, _stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropAllTables();
  }
};
