const log = require("debug")("newsscore:SyncScores");
const Stories = require('../models/story');
const ScoreAgent = require('../agents/ScoreAgent');

module.exports = async function SyncScores() {
    const stories = await Stories.findAll({
        where: {
            score: null
        }
    });

    log(`found ${stories.length} stories without scores`);

    for (const story of stories) {
        const score = await ScoreAgent(story.llm_fields);
        log(`updating score for ${story.title} to ${score}`);
        await story.update({ score });
    }
}