export default (sequelize, DataTypes) => {
  const Car = sequelize.define('Car', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    company: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    seats: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    price_per_day: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    image_url: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'cars',
    underscored: true
  });

  Car.associate = () => {};
  return Car;
};


