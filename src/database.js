const log = require("debug")("newsscore:database");

const sequelize = require("./sequelize");
require("./models");

async function initialize() {
    // await sequelize.sync({ alter: true });
}

async function close() {
    await sequelize.close();
}

module.exports = {
    initialize,
    close,
};
