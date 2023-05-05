const log = require("debug")("newsscore:SyncContent");
const Story = require('../models/story');
const Scraper = require('../services/Scraper');

module.exports = async function SyncContent() {
    const stories = await Story.findAll({
        where: {
            content: null
        }
    });

    log(`found ${stories.length} stories without content`);

    for (const story of stories) {
        const update = {};
        try {
            const data = await Scraper(story.url);
            if (!story.content) update.content = data.text;
            if (!story.image_url && data.images.length > 0) {
                update.image_url = data.images[0];
            }

            if (Object.keys(update).length === 0) {
                log(`no content to update for ${story.title}`);
                continue;
            }

            log(`updating '${story.title}' with ${JSON.stringify(update)}`);
            await story.update(update);
        } catch (e) {
            log(`error updating '${story.title}': ${e.message}`)
        }
    }
}