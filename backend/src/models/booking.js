export default (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    service_type: { type: DataTypes.ENUM('hotel', 'flight', 'car', 'activity'), allowNull: false },
    service_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    total_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'), allowNull: false, defaultValue: 'pending' }
  }, {
    tableName: 'bookings',
    underscored: true
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Booking;
};


