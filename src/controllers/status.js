const Story = require("../models/story");
const { Op } = require("sequelize");
const { DateTime } = require("luxon");

module.exports = async function (req, res) {
    try {
        const date = DateTime.utc();
        const start = date.startOf("day").toISO();
        const end = date.endOf("day").toISO();
        const score = process.env.NEWS_SCORE_CUTOFF;

        const storiesCount = await Story.count({
            where: {
                score: { [Op.gt]: score },
                final: true,
                headline: { [Op.ne]: null },
                createdAt: { [Op.between]: [start, end] }
            }
        });

        if (storiesCount > 0) {
            res.status(200).send("OK");
        } else {
            res.status(500).send("Error: No stories available for today");
        }
    } catch (error) {
        console.error("Status check error:", error);
        res.status(500).send("Error: Unable to check stories");
    }
};
