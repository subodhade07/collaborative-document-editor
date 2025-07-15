const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("collaborative_document_editor", "postgres", "subodh@123", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;
