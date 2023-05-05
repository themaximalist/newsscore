const log = require("debug")("newsscore:index");
const getNews = require("./news");
const CreateStory = require("./CreateStory")

module.exports = async function SyncNews(date = null) {
    const categories = ["business", "technology", "top", "politics", "world"];
    for (const category of categories) {
        const options = { category };
        if (date) options.date = date;
        const news = await getNews(options);
        for await (const story of news) {
            await CreateStory(story);
        }
    }
}