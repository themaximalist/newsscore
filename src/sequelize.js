const log = require("debug")("newsscore:sequelize");
const { Sequelize } = require("sequelize");
module.exports = new Sequelize(process.env.DATABASE_URI);
