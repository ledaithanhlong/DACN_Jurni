module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('flights', {
      id: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      airline: { type: Sequelize.STRING, allowNull: false },
      departure_city: { type: Sequelize.STRING, allowNull: false },
      arrival_city: { type: Sequelize.STRING, allowNull: false },
      departure_time: { type: Sequelize.DATE, allowNull: false },
      arrival_time: { type: Sequelize.DATE, allowNull: false },
      price: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      image_url: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('flights'); }
};


