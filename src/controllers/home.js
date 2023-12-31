const Story = require("../models/story");
const { Op } = require("sequelize");
const { DateTime } = require("luxon");

module.exports = async function (req, res) {

    const newsletter = !!req.cookies.newsletter;
    const visited = !!req.cookies.visited;
    if (!visited) {
        res.cookie("visited", true);
    }

    let score = req.query.score || process.env.NEWS_SCORE_CUTOFF;
    let date = DateTime.utc();
    if (req.query.date) {
        try {
            date = DateTime.fromFormat(req.query.date, "yyyy-MM-dd", { zone: "utc" });
        } catch (e) {
            log(`invalid date ${req.query.date}`);
            date = DateTime.utc();
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

    let last_modified = 0;
    for (const story of stories) {
        if (story.updatedAt > last_modified) {
            last_modified = story.updatedAt;
        }
    }

    res.render("home", {
        stories,
        visited,
        newsletter,
        date: date.toISODate(),
        last_modified: last_modified.toISOString(),
    });
};