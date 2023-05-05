require("dotenv").config();
const debug = require("debug")("app");
const getNews = require("./services/news");
const getScore = require("./services/score");
const { appendFileSync } = require("fs");
// const server = require("./server");
// server.start();

async function main() {
    const news = await getNews();
    console.log(`found ${news.length} news stories`);
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
}

main();