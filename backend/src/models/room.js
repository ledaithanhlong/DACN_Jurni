export default (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    hotel_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    price_per_night: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    capacity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    image_url: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'rooms',
    underscored: true
  });

  Room.associate = (models) => {
    Room.belongsTo(models.Hotel, { foreignKey: 'hotel_id', as: 'hotel' });
  };

  return Room;
};


