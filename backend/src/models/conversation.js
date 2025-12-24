export default (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    roomId: { type: DataTypes.STRING, primaryKey: true }, // User ID or Guest ID
    consultantId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }, // Staff ID
    status: { 
      type: DataTypes.ENUM('pending', 'active', 'ended'), 
      defaultValue: 'pending' 
    },
    lastMessageAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'Conversations',
    timestamps: true
  });

  return Conversation;
};
