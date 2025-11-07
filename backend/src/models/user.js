export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
    clerkId: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'users',
    underscored: true
  });

  User.associate = (models) => {
    User.hasMany(models.Booking, { foreignKey: 'user_id', as: 'bookings' });
    User.hasMany(models.Favorite, { foreignKey: 'user_id', as: 'favorites' });
    User.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notifications' });
  };

  return User;
};


