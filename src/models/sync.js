const { DataTypes, Model } = require("sequelize");

const sequelize = require("../sequelize");

class Sync extends Model {
}

Sync.init({
    service: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false,
    },
    runs: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize,
});

module.exports = Sync;