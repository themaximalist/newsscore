const RSSParser = require("rss-parser");

function extractURLs(html) {
    const regex = /href="(https?:\/\/(?!(www\.)?reddit\.com)[^"]*)"/g;
    const urls = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
        urls.push(match[1]);
    }

    return urls;
};

async function reddit(url = "https://www.reddit.com/r/technology.rss") {
    const parser = new RSSParser();
    const feed = await parser.parseURL(url);
    return feed.items.map(item => extractURLs(item.content)).flat();
}

reddit.service = "reddit";
reddit.category = "technology";

module.exports = reddit;