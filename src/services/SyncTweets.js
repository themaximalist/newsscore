const log = require("debug")("newsscore:SyncTweets");
const Story = require('../models/story');
const TweetStory = require('../services/TweetStory')
const { Op } = require("sequelize");

module.exports = async function SyncHeadlines() {
    log(`sync tweets`);
    const stories = await Story.findAll({
        where: {
            final: true,
            tweet_id: null,
            score: {
                [Op.gte]: process.env.NEWS_SCORE_CUTOFF
            },
            headline: {
                [Op.ne]: null
            }
        }
    });

    log(`found ${stories.length} score>=${process.env.NEWS_SCORE_CUTOFF} stories without tweets`);
    if (stories.length == 0) return;

    let i = 0;
    for (const story of stories) {
        const tweet_id = await TweetStory(story);
        await story.update({ tweet_id });
        await new Promise(resolve => setTimeout(resolve, 15000));
        if (++i >= process.env.SYNC_TWEETS_PER_RUN) {
            log(`reached max tweets per run ${process.env.SYNC_TWEETS_PER_RUN} stopping...`);
            break;
        }
    }

    log(`done syncing tweets`);
}