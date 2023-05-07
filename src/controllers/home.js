const Story = require("../models/story");
const { Op } = require("sequelize");
const { DateTime } = require("luxon");

module.exports = async function (req, res) {

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
            final_score: true,
            headline: { [Op.ne]: null },
            publish_date: { [Op.between]: [start, end] }
        },
        order: [["score", "DESC"]],
    });

    res.render("home", {
        stories,
        date: date.toISODate(),
    });
};