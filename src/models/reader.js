const { DataTypes, Model } = require("sequelize");

const sequelize = require("../sequelize");

class Reader extends Model {
}

Reader.init({
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize,
});

module.exports = Reader;