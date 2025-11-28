'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('hotels', 'address', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    
    await queryInterface.addColumn('hotels', 'star_rating', {
      type: Sequelize.DECIMAL(2, 1),
      allowNull: true
    });
    
    await queryInterface.addColumn('hotels', 'images', {
      type: Sequelize.JSON,
      allowNull: true
    });
    
    await queryInterface.addColumn('hotels', 'check_in_time', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: '14:00'
    });
    
    await queryInterface.addColumn('hotels', 'check_out_time', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: '12:00'
    });
    
    await queryInterface.addColumn('hotels', 'total_rooms', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true
    });
    
    await queryInterface.addColumn('hotels', 'total_floors', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true
    });
    
    await queryInterface.addColumn('hotels', 'amenities', {
      type: Sequelize.JSON,
      allowNull: true
    });
    
    await queryInterface.addColumn('hotels', 'policies', {
      type: Sequelize.JSON,
      allowNull: true
    });
    
    await queryInterface.addColumn('hotels', 'nearby_attractions', {
      type: Sequelize.JSON,
      allowNull: true
    });
    
    await queryInterface.addColumn('hotels', 'public_transport', {
      type: Sequelize.JSON,
      allowNull: true
    });
    
    await queryInterface.addColumn('hotels', 'has_breakfast', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    
    await queryInterface.addColumn('hotels', 'has_parking', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    
    await queryInterface.addColumn('hotels', 'has_wifi', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true
    });
    
    await queryInterface.addColumn('hotels', 'has_pool', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    
    await queryInterface.addColumn('hotels', 'has_restaurant', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    
    await queryInterface.addColumn('hotels', 'has_gym', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    
    await queryInterface.addColumn('hotels', 'has_spa', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    
    await queryInterface.addColumn('hotels', 'allows_pets', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    
    await queryInterface.addColumn('hotels', 'is_smoking_allowed', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('hotels', 'address');
    await queryInterface.removeColumn('hotels', 'star_rating');
    await queryInterface.removeColumn('hotels', 'images');
    await queryInterface.removeColumn('hotels', 'check_in_time');
    await queryInterface.removeColumn('hotels', 'check_out_time');
    await queryInterface.removeColumn('hotels', 'total_rooms');
    await queryInterface.removeColumn('hotels', 'total_floors');
    await queryInterface.removeColumn('hotels', 'amenities');
    await queryInterface.removeColumn('hotels', 'policies');
    await queryInterface.removeColumn('hotels', 'nearby_attractions');
    await queryInterface.removeColumn('hotels', 'public_transport');
    await queryInterface.removeColumn('hotels', 'has_breakfast');
    await queryInterface.removeColumn('hotels', 'has_parking');
    await queryInterface.removeColumn('hotels', 'has_wifi');
    await queryInterface.removeColumn('hotels', 'has_pool');
    await queryInterface.removeColumn('hotels', 'has_restaurant');
    await queryInterface.removeColumn('hotels', 'has_gym');
    await queryInterface.removeColumn('hotels', 'has_spa');
    await queryInterface.removeColumn('hotels', 'allows_pets');
    await queryInterface.removeColumn('hotels', 'is_smoking_allowed');
  }
};



