'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns to hotels table
    await queryInterface.addColumn('hotels', 'stars', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'type', {
      type: Sequelize.ENUM('Resort', 'Hotel', 'Homestay', 'Villa', 'Boutique'),
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'address', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'city', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'website', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'amenities', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'check_in', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'check_out', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'policy_cancel', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'policy_children', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'policy_pet', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'thumbnail_url', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'gallery_urls', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('hotels', 'status', {
      type: Sequelize.ENUM('pending', 'approved'),
      allowNull: false,
      defaultValue: 'pending'
    });

    await queryInterface.addColumn('hotels', 'created_by', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('hotels', 'approved_by', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('hotels', 'stars');
    await queryInterface.removeColumn('hotels', 'type');
    await queryInterface.removeColumn('hotels', 'address');
    await queryInterface.removeColumn('hotels', 'city');
    await queryInterface.removeColumn('hotels', 'latitude');
    await queryInterface.removeColumn('hotels', 'longitude');
    await queryInterface.removeColumn('hotels', 'phone');
    await queryInterface.removeColumn('hotels', 'email');
    await queryInterface.removeColumn('hotels', 'website');
    await queryInterface.removeColumn('hotels', 'amenities');
    await queryInterface.removeColumn('hotels', 'check_in');
    await queryInterface.removeColumn('hotels', 'check_out');
    await queryInterface.removeColumn('hotels', 'policy_cancel');
    await queryInterface.removeColumn('hotels', 'policy_children');
    await queryInterface.removeColumn('hotels', 'policy_pet');
    await queryInterface.removeColumn('hotels', 'thumbnail_url');
    await queryInterface.removeColumn('hotels', 'gallery_urls');
    await queryInterface.removeColumn('hotels', 'status');
    await queryInterface.removeColumn('hotels', 'created_by');
    await queryInterface.removeColumn('hotels', 'approved_by');
  }
};

