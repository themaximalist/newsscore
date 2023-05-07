require("dotenv").config()
const log = require("debug")("newsscore:rescore");

const Story = require("./models/story");
const ScoreAgent = require("./agents/ScoreAgent");

async function main() {
    const id = process.argv[2];
    const story = await Story.findByPk(id);
    if (!story) {
        console.log(`story not found`);
        return;
    }

    log(`rescoring ${story.title}...`);

    const score = await ScoreAgent(story.llm_fields);
    log(`updating score for ${story.title} from ${story.score} -> ${score}`);

    await story.update({ score, final: true });
}

main();