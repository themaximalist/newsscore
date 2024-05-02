const axios = require("axios");

const Cache = require("file-system-cache").default;

const cache = Cache({ ns: "hackernews" });

async function story(story_id) {
    try {
        const cached = await cache.get(story_id);
        if (cached) return cached;
    } catch (e) {
        console.log("CACHING ERROR", e);
    }

    const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${story_id}.json`);
    let url = response.data.url;
    if (!url) {
        url = `https://news.ycombinator.com/item?id=${story_id}`;
    }

    await cache.set(story_id, url)
    return url;
}

async function hackernews(num = 40) {
    const response = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
    if (response.status !== 200) throw new Error(`Error fetching top stories: ${response.status}`)

    const story_ids = response.data.slice(0, num);
    if (story_ids.length !== num) throw new Error(`Error fetching top stories: ${story_ids.length} stories returned`);

    return await Promise.all(story_ids.map(story));
}

hackernews.service = "hackernews";
hackernews.category = "technology";


module.exports = hackernews;