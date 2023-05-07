const log = require("debug")("newsscore:HighpassFilter");
const HighpassFilterAgent = require("../agents/HighpassFilterAgent");
const Story = require('../models/story');
const AI = require("@themaximalist/ai.js");

async function filter() {
    const stories = await Story.findAll({
        where: {
            score: null
        },
        order: [
            ['publish_date', 'DESC']
        ],
        limit: 50,
    });

    log(`found ${stories.length} stories without scores`);
    if (stories.length == 0) return false;

    const articles = stories.map(story => {
        return { title: story.title, id: story.id };
    });

    const scores = await HighpassFilterAgent(articles);
    console.log(scores);
    for (const story of stories) {
        const score = scores[story.id];
        if (!score || !parseInt(score)) {
            log(`skipping story '${story.title}' with score ${scores[story.id]}`);
            continue;
        }

        if (score >= process.env.NEWS_SCORE_CUTOFF) {
            log(`FOUND BIG STORY '${story.title}' with score ${scores[story.id]}`);
        } else {
            log(`updating story '${story.title}' with score ${scores[story.id]}`);
        }

        await story.update({ score: scores[story.id] });
    }

    log(`updated ${stories.length} stories with scores`);

    return true;
}

module.exports = async function () {
    while (true) {
        log(`running highpass filter`);
        if (!await filter()) {
            log(`no more stories to filter`);
            return;
        }
    }
}