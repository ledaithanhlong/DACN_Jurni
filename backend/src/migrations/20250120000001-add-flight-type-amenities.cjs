'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm cột flight_type
    await queryInterface.addColumn('flights', 'flight_type', {
      type: Sequelize.ENUM('economy', 'premium_economy', 'business', 'first_class'),
      allowNull: true,
      defaultValue: 'economy'
    });

    // Thêm cột amenities (tiện ích)
    await queryInterface.addColumn('flights', 'amenities', {
      type: Sequelize.JSON,
      allowNull: true
    });

    // Thêm cột policies (chính sách)
    await queryInterface.addColumn('flights', 'policies', {
      type: Sequelize.JSON,
      allowNull: true
    });

    // Thêm cột available_seats (số ghế còn lại)
    await queryInterface.addColumn('flights', 'available_seats', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 180
    });

    // Thêm cột flight_number (mã chuyến bay)
    await queryInterface.addColumn('flights', 'flight_number', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('flights', 'flight_type');
    await queryInterface.removeColumn('flights', 'amenities');
    await queryInterface.removeColumn('flights', 'policies');
    await queryInterface.removeColumn('flights', 'available_seats');
    await queryInterface.removeColumn('flights', 'flight_number');
    
    // Xóa ENUM type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_flights_flight_type;');
  }
};



