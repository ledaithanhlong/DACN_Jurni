export default (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    senderId: { type: DataTypes.STRING, allowNull: false }, // Can be 'staff' or a clerk user ID
    receiverId: { type: DataTypes.STRING, allowNull: true }, // Optional for broadcast or room-based
    content: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    roomId: { type: DataTypes.STRING, allowNull: false } // To group conversations (e.g. by customer userId)
  }, {
    tableName: 'Messages',
    timestamps: true
  });

  return Message;
};
