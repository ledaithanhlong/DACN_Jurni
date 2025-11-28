'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('hotels', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    });

    await queryInterface.addColumn('hotels', 'approved_by', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('hotels', 'approved_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('hotels', 'approval_note', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('hotels', 'approval_note');
    await queryInterface.removeColumn('hotels', 'approved_at');
    await queryInterface.removeColumn('hotels', 'approved_by');
    await queryInterface.removeColumn('hotels', 'status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_hotels_status";');
  }
};

