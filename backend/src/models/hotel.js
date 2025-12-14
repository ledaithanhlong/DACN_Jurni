export default (sequelize, DataTypes) => {
  const Hotel = sequelize.define('Hotel', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING },
    check_in_time: { type: DataTypes.STRING, allowNull: false },
    check_out_time: { type: DataTypes.STRING, allowNull: false },
    total_floors: { type: DataTypes.INTEGER },
    amenities: { type: DataTypes.JSON },
    policies: { type: DataTypes.JSON }
  }, {
    tableName: 'Hotels',
    timestamps: true
  });

  Hotel.associate = (models) => {
    Hotel.hasMany(models.Room, { foreignKey: 'hotel_id', as: 'rooms' });
    Hotel.hasMany(models.Booking, { foreignKey: 'hotel_id', as: 'bookings' });
  };

  return Hotel;
};
