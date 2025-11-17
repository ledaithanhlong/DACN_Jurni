'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change ENUM to include admin2
    await queryInterface.sequelize.query(`
      ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin', 'admin2') NOT NULL DEFAULT 'user';
    `);
  },

  async down(queryInterface, Sequelize) {
    // Revert back to original ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin') NOT NULL DEFAULT 'user';
    `);
  }
};

