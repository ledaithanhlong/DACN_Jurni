'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('flights', 'flight_number', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('flights', 'departure_airport', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('flights', 'departure_airport_code', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('flights', 'arrival_airport', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('flights', 'arrival_airport_code', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('flights', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    
    await queryInterface.addColumn('flights', 'class', {
      type: Sequelize.ENUM('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'),
      allowNull: false,
      defaultValue: 'ECONOMY'
    });
    
    await queryInterface.addColumn('flights', 'aircraft_type', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('flights', 'baggage_allowance', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('flights', 'hand_luggage', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('flights', 'meal_included', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    
    await queryInterface.addColumn('flights', 'wifi_available', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    
    await queryInterface.addColumn('flights', 'entertainment', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    
    await queryInterface.addColumn('flights', 'seat_selection', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    
    await queryInterface.addColumn('flights', 'refundable', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    
    await queryInterface.addColumn('flights', 'changeable', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    
    await queryInterface.addColumn('flights', 'available_seats', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 0
    });
    
    await queryInterface.addColumn('flights', 'total_seats', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true
    });
    
    await queryInterface.addColumn('flights', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    
    await queryInterface.addColumn('flights', 'amenities', {
      type: Sequelize.JSON,
      allowNull: true
    });
    
    await queryInterface.addColumn('flights', 'policies', {
      type: Sequelize.JSON,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('flights', 'flight_number');
    await queryInterface.removeColumn('flights', 'departure_airport');
    await queryInterface.removeColumn('flights', 'departure_airport_code');
    await queryInterface.removeColumn('flights', 'arrival_airport');
    await queryInterface.removeColumn('flights', 'arrival_airport_code');
    await queryInterface.removeColumn('flights', 'duration');
    await queryInterface.removeColumn('flights', 'class');
    await queryInterface.removeColumn('flights', 'aircraft_type');
    await queryInterface.removeColumn('flights', 'baggage_allowance');
    await queryInterface.removeColumn('flights', 'hand_luggage');
    await queryInterface.removeColumn('flights', 'meal_included');
    await queryInterface.removeColumn('flights', 'wifi_available');
    await queryInterface.removeColumn('flights', 'entertainment');
    await queryInterface.removeColumn('flights', 'seat_selection');
    await queryInterface.removeColumn('flights', 'refundable');
    await queryInterface.removeColumn('flights', 'changeable');
    await queryInterface.removeColumn('flights', 'available_seats');
    await queryInterface.removeColumn('flights', 'total_seats');
    await queryInterface.removeColumn('flights', 'description');
    await queryInterface.removeColumn('flights', 'amenities');
    await queryInterface.removeColumn('flights', 'policies');
    // Note: ENUM type cleanup is handled automatically by Sequelize in MySQL
  }
};

