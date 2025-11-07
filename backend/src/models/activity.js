export default (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    image_url: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'activities',
    underscored: true
  });

  Activity.associate = () => {};
  return Activity;
};

