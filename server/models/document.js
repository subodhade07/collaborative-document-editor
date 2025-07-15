const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Document = sequelize.define("Document", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: "",
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

module.exports = Document;
