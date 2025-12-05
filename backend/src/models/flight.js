export default (sequelize, DataTypes) => {
  const Flight = sequelize.define('Flight', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    airline: { type: DataTypes.STRING, allowNull: false },
    flight_number: { type: DataTypes.STRING, allowNull: true }, // VD: VN123
    departure_city: { type: DataTypes.STRING, allowNull: false },
    departure_airport: { type: DataTypes.STRING, allowNull: true }, // Tên sân bay
    departure_airport_code: { type: DataTypes.STRING, allowNull: true }, // Mã sân bay (VD: SGN)
    arrival_city: { type: DataTypes.STRING, allowNull: false },
    arrival_airport: { type: DataTypes.STRING, allowNull: true },
    arrival_airport_code: { type: DataTypes.STRING, allowNull: true }, // Mã sân bay (VD: HAN)
    departure_time: { type: DataTypes.DATE, allowNull: false },
    arrival_time: { type: DataTypes.DATE, allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: true }, // Thời gian bay tính bằng phút
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    class: { type: DataTypes.ENUM('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'), allowNull: false, defaultValue: 'ECONOMY' },
    aircraft_type: { type: DataTypes.STRING, allowNull: true }, // Loại máy bay (VD: Airbus A321, Boeing 787)
    baggage_allowance: { type: DataTypes.STRING, allowNull: true }, // Hành lý ký gửi (VD: "20kg")
    hand_luggage: { type: DataTypes.STRING, allowNull: true }, // Hành lý xách tay (VD: "7kg")
    meal_included: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    wifi_available: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    entertainment: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    seat_selection: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    refundable: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    changeable: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    available_seats: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, defaultValue: 0 },
    total_seats: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    image_url: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    amenities: { type: DataTypes.JSON, allowNull: true }, // Mảng các tiện nghi
    policies: { type: DataTypes.JSON, allowNull: true } // Chính sách đổi/hủy vé
  }, {
    tableName: 'flights',
    underscored: true
  });

  Flight.associate = () => {};
  return Flight;
};

