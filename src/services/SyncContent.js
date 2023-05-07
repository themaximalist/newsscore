const log = require("debug")("newsscore:SyncContent");
const async = require("async");
const Story = require('../models/story');
const { Scrape } = require("@themaximalist/scrap.js");
const { Op } = require("sequelize");

async function SyncStory(story) {
    try {
        const result = await Scrape(story.url);
        if (!result || !result.content) {
            throw new Error(`no content to update for ${story.title}`);
        }

        log(`updating '${story.title}' with content ${result.content.length}`);
        await story.update({
            content: result.content,
            url: result.url,
        });
    } catch (e) {
        log(`error updating '${story.url}': ${e.message}`);
        return null;
    }
}

module.exports = async function SyncContent() {

    log(`sync content`);

    const stories = await Story.findAll({
        where: {
            content: null,
            headline: null,
            score: {
                [Op.gte]: process.env.NEWS_SCORE_CUTOFF
            }
        },
        order: [
            ['publish_date', 'DESC']
        ]
    });

    log(`found ${stories.length} stories content=null headline=null score>=${process.env.NEWS_SCORE_CUTOFF}`);
    if (stories.length == 0) return;

    return new Promise((resolve, reject) => {
        async.eachLimit(stories, process.env.NUM_SCRAP_WORKERS, SyncStory, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}