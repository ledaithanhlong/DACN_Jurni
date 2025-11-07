export default (sequelize, DataTypes) => {
  const Flight = sequelize.define('Flight', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    airline: { type: DataTypes.STRING, allowNull: false },
    departure_city: { type: DataTypes.STRING, allowNull: false },
    arrival_city: { type: DataTypes.STRING, allowNull: false },
    departure_time: { type: DataTypes.DATE, allowNull: false },
    arrival_time: { type: DataTypes.DATE, allowNull: false },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    image_url: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'flights',
    underscored: true
  });

  Flight.associate = () => {};
  return Flight;
};

