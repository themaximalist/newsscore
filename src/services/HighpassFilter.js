const log = require("debug")("newsscore:HighpassFilter");
const HighpassFilterAgent = require("../agents/HighpassFilterAgent");
const Story = require('../models/story');
const AI = require("@themaximalist/ai.js");

async function filter() {
    const stories = await Story.findAll({
        where: {
            score: null,
            final: false
        },
        order: [
            ['createdAt', 'DESC']
        ],
        limit: 100,
    });

    log(`found ${stories.length} stories without scores`);
    if (stories.length == 0) return false;

    const articles = stories.map(story => {
        return { title: story.title.substr(0, 200), id: story.id };
    });

    let processedCount = 0;
    const scores = await HighpassFilterAgent(articles);
    for (const story of stories) {
        const score = scores[story.id];
        if (!score || !parseInt(score)) {
            log(`skipping story '${story.title}' with score ${scores[story.id]}`);
            await story.update({ score: 0 });
        } else {
            if (score >= process.env.NEWS_SCORE_CUTOFF) {
                log(`FOUND BIG STORY '${story.title}' with score ${scores[story.id]}`);
            } else {
                log(`updating story '${story.title}' with score ${scores[story.id]}`);
            }
            await story.update({ score: scores[story.id] });
        }

        processedCount++;
    }

    log(`updated ${processedCount} stories with scores`);

    return processedCount === 100;
}

module.exports = async function () {
    let continueFiltering = true;
    while (continueFiltering) {
        log(`running highpass filter`);
        continueFiltering = await filter();
    }
    log(`no more stories to filter or reached 100 story limit`);
}
