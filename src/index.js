require("dotenv").config();
const log = require("debug")("newsscore:index");
const getNews = require("./services/news");
const CreateStory = require("./services/CreateStory")
// const getScore = require("./services/score");
// const { appendFileSync } = require("fs");
const database = require("./database");

async function main() {
    await database.initialize();

    const categories = ["business", "technology", "top", "politics", "world"];
    for (const category of categories) {
        log(`fetching news for ${category}`)
        const news = await getNews({ category });
        for await (const story of news) {
            await CreateStory(story);
        }
    }
    /*
    for (const story of news) {
        try {
            console.log(JSON.stringify(story, null, 4));
            const score = await getScore(story);
            console.log(score, story.title)
            appendFileSync("scores.txt", `${score} ${story.title}\n`);
        } catch (e) {
            console.error(e);
        }
    }

    console.log(news.length);
    */
}

main();