module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      id: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      service_type: { type: Sequelize.ENUM('hotel', 'flight', 'car', 'activity'), allowNull: false },
      service_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      total_price: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'), allowNull: false, defaultValue: 'pending' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('bookings'); }
};


