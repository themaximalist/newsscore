const { Sequelize, Op } = require("sequelize");
const Story = require("../models/story");

async function getLeaderboard() {
    return await Story.findAll({
        attributes: [
            "source",
            [Sequelize.fn("AVG", Sequelize.col("score")), "average_score"]
        ],
        where: {
            score: {
                [Op.ne]: null
            }
        },
        group: ["source"],
        order: [[Sequelize.fn("AVG", Sequelize.col("score")), "DESC"]],
        raw: true
    });
}

module.exports = async function (req, res) {
    const leaderboard = await getLeaderboard();
    console.log(leaderboard);
    res.render("leaderboard", { leaderboard });
}