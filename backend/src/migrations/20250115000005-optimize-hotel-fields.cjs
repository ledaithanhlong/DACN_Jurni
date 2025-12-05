'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Kiểm tra và xóa cột rating nếu tồn tại (trùng lặp với star_rating)
    const tableDescription = await queryInterface.describeTable('hotels');
    
    if (tableDescription.rating) {
      await queryInterface.removeColumn('hotels', 'rating');
    }
    
    // Kiểm tra và xóa cột hotel_type nếu tồn tại (không được sử dụng)
    if (tableDescription.hotel_type) {
      await queryInterface.removeColumn('hotels', 'hotel_type');
    }
  },

  async down(queryInterface, Sequelize) {
    // Khôi phục lại các cột nếu cần rollback
    const tableDescription = await queryInterface.describeTable('hotels');
    
    if (!tableDescription.rating) {
      await queryInterface.addColumn('hotels', 'rating', {
        type: Sequelize.FLOAT,
        allowNull: true
      });
    }
    
    if (!tableDescription.hotel_type) {
      await queryInterface.addColumn('hotels', 'hotel_type', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  }
};

