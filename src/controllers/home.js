const Story = require("../models/story");
const { Op } = require("sequelize");
const { DateTime } = require("luxon");

module.exports = async function (req, res) {

    let date = DateTime.utc();
    if (req.query.date) {
        try {
            date = DateTime.fromISO(req.query.date);
        } catch (e) {
            log(`invalid date ${req.query.date}`);
            date = DateTime.utc();
        }
    }

    const start = date.startOf("day").toISO();
    const end = date.endOf("day").toISO();

    const stories = await Story.findAll({
        where: {
            score: { [Op.gt]: 600 },
            publish_date: { [Op.between]: [start, end] }
        },
        order: [["score", "DESC"]],
    });
    res.render("home", { stories });
};