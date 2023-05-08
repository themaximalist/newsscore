const Story = require("../models/story");
const { Op } = require("sequelize");
const { DateTime } = require("luxon");

module.exports = async function (req, res) {

    const visited = !!req.cookies.visited;
    if (!visited) {
        res.cookie("visited", true);
    }

    let score = req.query.score || process.env.NEWS_SCORE_CUTOFF;
    let date = DateTime.local();
    if (req.query.date) {
        try {
            date = DateTime.fromISO(req.query.date);
        } catch (e) {
            log(`invalid date ${req.query.date}`);
            date = DateTime.local();
        }
    }

    const start = date.startOf("day").toISO();
    const end = date.endOf("day").toISO();

    const stories = await Story.findAll({
        where: {
            score: { [Op.gt]: score },
            final: true,
            headline: { [Op.ne]: null },
            createdAt: { [Op.between]: [start, end] }
        },
        order: [["score", "DESC"]],
    });

    res.render("home", {
        stories,
        visited,
        date: date.toISODate(),
    });
};