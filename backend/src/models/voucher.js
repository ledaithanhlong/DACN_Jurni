export default (sequelize, DataTypes) => {
  const Voucher = sequelize.define('Voucher', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    discount_percent: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    expiry_date: { type: DataTypes.DATE, allowNull: false }
  }, {
    tableName: 'vouchers',
    underscored: true
  });

  Voucher.associate = () => {};
  return Voucher;
};


