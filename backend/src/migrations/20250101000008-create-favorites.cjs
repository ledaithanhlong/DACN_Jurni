'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('favorites', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      service_type: {
        type: Sequelize.ENUM('hotel', 'flight', 'car', 'activity'),
        allowNull: false
      },
      service_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint to prevent duplicate favorites
    await queryInterface.addIndex('favorites', ['user_id', 'service_type', 'service_id'], {
      unique: true,
      name: 'unique_user_service_favorite'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('favorites');
  }
};



