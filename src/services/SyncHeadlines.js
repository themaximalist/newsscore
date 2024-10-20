const log = require("debug")("newsscore:SyncHeadlines");
const Story = require('../models/story');
const HeadlineAgent = require('../agents/HeadlineAgent');
const { Op } = require("sequelize");

module.exports = async function SyncHeadlines() {
    log(`sync headlines`);
    const stories = await Story.findAll({
        where: {
            final: true,
            score: {
                [Op.gte]: process.env.NEWS_SCORE_CUTOFF
            },
            headline: null
        },
        order: [
            ['createdAt', 'DESC']
        ],
    });

    log(`found ${stories.length} score>=${process.env.NEWS_SCORE_CUTOFF} stories without headlines`);
    if (stories.length == 0) return;

    let i = 0;
    for (const story of stories) {
        console.log(story.title);
        try {
            const headline = await HeadlineAgent(story.llm_fields);
            log(`updating headline from '${story.title}' to '${headline}'`);
            await story.update({ headline });
        } catch (e) {
            log(`error updating headline from '${story.title}' to '${headline}'`);
        } finally {
            if (++i % 10 == 0) {
                log(`sleeping for 15 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 15000));
            }
        }
    }
}