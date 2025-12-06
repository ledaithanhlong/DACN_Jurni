'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bookings', 'room_type', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
      comment: 'Loại phòng được đặt (standard, deluxe, suite, family)'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bookings', 'room_type');
  }
};
