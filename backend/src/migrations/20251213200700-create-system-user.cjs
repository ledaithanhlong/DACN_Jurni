'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Create system user for guest bookings
        await queryInterface.bulkInsert('users', [{
            id: 1,
            name: 'System User',
            email: 'system@jurni.com',
            role: 'user',
            created_at: new Date(),
            updated_at: new Date()
        }], {
            ignoreDuplicates: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', { id: 1 }, {});
    }
};
