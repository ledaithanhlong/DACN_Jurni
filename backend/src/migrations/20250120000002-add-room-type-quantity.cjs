'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm cột room_type
    await queryInterface.addColumn('rooms', 'room_type', {
      type: Sequelize.ENUM('standard', 'deluxe', 'suite', 'family'),
      allowNull: true,
      defaultValue: 'standard'
    });

    // Thêm cột quantity (số lượng phòng của loại này)
    await queryInterface.addColumn('rooms', 'quantity', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 1
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('rooms', 'room_type');
    await queryInterface.removeColumn('rooms', 'quantity');
    
    // Xóa ENUM type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_rooms_room_type;');
  }
};


