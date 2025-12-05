export default (sequelize, DataTypes) => {
  const Hotel = sequelize.define('Hotel', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    star_rating: { type: DataTypes.DECIMAL(2,1), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    image_url: { type: DataTypes.STRING, allowNull: true },
    images: { type: DataTypes.JSON, allowNull: true }, // Mảng các hình ảnh
    check_in_time: { type: DataTypes.STRING, allowNull: true, defaultValue: '14:00' }, // Giờ check-in
    check_out_time: { type: DataTypes.STRING, allowNull: true, defaultValue: '12:00' }, // Giờ check-out
    total_rooms: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }, // Tổng số phòng
    total_floors: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }, // Số tầng
    amenities: { type: DataTypes.JSON, allowNull: true },
    policies: { type: DataTypes.JSON, allowNull: true },
    nearby_attractions: { type: DataTypes.JSON, allowNull: true },
    public_transport: { type: DataTypes.JSON, allowNull: true },
    has_breakfast: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    has_parking: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    has_wifi: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
    has_pool: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    has_restaurant: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    has_gym: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    has_spa: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    allows_pets: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    is_smoking_allowed: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    approved_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    approved_at: { type: DataTypes.DATE, allowNull: true },
    approval_note: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'hotels',
    underscored: true
  });

  Hotel.associate = (models) => {
    Hotel.hasMany(models.Room, { foreignKey: 'hotel_id', as: 'rooms' });
  };

  return Hotel;
};

