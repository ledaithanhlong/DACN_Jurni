export default (sequelize, DataTypes) => {
  const Hotel = sequelize.define('Hotel', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    rating: { type: DataTypes.FLOAT, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    image_url: { type: DataTypes.STRING, allowNull: true },
    // New fields
    stars: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    type: { type: DataTypes.ENUM('Resort', 'Hotel', 'Homestay', 'Villa', 'Boutique'), allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    website: { type: DataTypes.STRING, allowNull: true },
    amenities: { type: DataTypes.JSON, allowNull: true },
    checkIn: { type: DataTypes.STRING, allowNull: true },
    checkOut: { type: DataTypes.STRING, allowNull: true },
    policyCancel: { type: DataTypes.TEXT, allowNull: true },
    policyChildren: { type: DataTypes.TEXT, allowNull: true },
    policyPet: { type: DataTypes.TEXT, allowNull: true },
    thumbnailUrl: { type: DataTypes.STRING, allowNull: true },
    galleryUrls: { type: DataTypes.JSON, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'approved'), allowNull: false, defaultValue: 'pending' },
    createdBy: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    approvedBy: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }
  }, {
    tableName: 'hotels',
    underscored: true
  });

  Hotel.associate = (models) => {
    Hotel.hasMany(models.Room, { foreignKey: 'hotel_id', as: 'rooms' });
    Hotel.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
    Hotel.belongsTo(models.User, { foreignKey: 'approved_by', as: 'approver' });
  };

  return Hotel;
};

