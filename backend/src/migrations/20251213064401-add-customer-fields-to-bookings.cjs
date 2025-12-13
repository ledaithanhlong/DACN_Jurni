'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('bookings', 'customer_name', {
            type: Sequelize.STRING(255),
            allowNull: true,
            after: 'status'
        });

        await queryInterface.addColumn('bookings', 'customer_email', {
            type: Sequelize.STRING(255),
            allowNull: true,
            after: 'customer_name'
        });

        await queryInterface.addColumn('bookings', 'customer_phone', {
            type: Sequelize.STRING(50),
            allowNull: true,
            after: 'customer_email'
        });

        await queryInterface.addColumn('bookings', 'payment_method', {
            type: Sequelize.STRING(100),
            allowNull: true,
            after: 'customer_phone'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('bookings', 'customer_name');
        await queryInterface.removeColumn('bookings', 'customer_email');
        await queryInterface.removeColumn('bookings', 'customer_phone');
        await queryInterface.removeColumn('bookings', 'payment_method');
    }
};
