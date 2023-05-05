const log = require("debug")("newsscore:CreateStory");
const Story = require("../models/story");
const { sha256, newsDateToUTC } = require("../utils");

module.exports = async function createStory(story) {
    log(`creating story ${story.title}...`);

    const fingerprint = await sha256(story.link);
    const publish_date = newsDateToUTC(story.pubDate);
    const options = {
        fingerprint,
        publish_date,
        category: story.category[0],
        service: "newsdata",
        source: story.source_id,
        url: story.link,
        title: story.title,
        description: story.description,
        content: story.content,
        image_url: story.image_url,
        data: story
    };

    try {
        const created = await Story.create(options);
        if (!created) throw new Error(`failed to create story ${story.link}`);
        return created;
    } catch (e) {
        if (e.name == "SequelizeUniqueConstraintError" && e.errors[0].type == "unique violation" && e.errors[0].path == "fingerprint") {
            log(`story ${story.link} already exists`);
            return null;
        }
        console.log(`failed to create story`)
        console.log(story);
        throw e;
    }
}