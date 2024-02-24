const Story = require("../models/story");

module.exports = async function (req, res) {
    const { id } = req.params;
    const story = await Story.findByPk(id);
    console.log("STORY", story);

    res.render("story", { story });
}
