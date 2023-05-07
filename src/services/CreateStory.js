const log = require("debug")("newsscore:CreateStory");
const Story = require("../models/story");
const FingerprintLink = require("./FingerprintLink");

module.exports = async function createStory(story) {
    log(`creating story ${story.title}...`);

    const options = Object.assign({}, story);
    options.fingerprint = await FingerprintLink(story.url);
    options.data = story;

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