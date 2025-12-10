'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add aircraft column if it doesn't exist
        const tableInfo = await queryInterface.describeTable('flights');

        if (!tableInfo.aircraft) {
            await queryInterface.addColumn('flights', 'aircraft', {
                type: Sequelize.STRING,
                allowNull: true
            });
        }

        if (!tableInfo.ticket_options) {
            await queryInterface.addColumn('flights', 'ticket_options', {
                type: Sequelize.JSON,
                allowNull: true
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableInfo = await queryInterface.describeTable('flights');

        if (tableInfo.ticket_options) {
            await queryInterface.removeColumn('flights', 'ticket_options');
        }

        if (tableInfo.aircraft) {
            await queryInterface.removeColumn('flights', 'aircraft');
        }
    }
};
