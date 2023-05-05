const { DataTypes, Model } = require("sequelize");

const sequelize = require("../sequelize");

class Story extends Model {
}

Story.init({
    fingerprint: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    publish_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    service: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    data: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    headline: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize,
});

module.exports = Story;