const log = require("debug")("newsscore:news");
const axios = require("axios");

const now = (new Date()).toISOString();

module.exports = async function getNews(term = null, limit = 100) {

    const url = `https://newsdata.io/api/1/archive?apikey=${process.env.NEWSDATA_API_KEY}&language=en&category=technology&from_date=2023-04-30&to_date=2023-04-30`;

    log(`Fetching news from ${url}...`);
    const response = await axios.get(url);
    if (response.status !== 200) {
        log(`Error fetching news: ${response.status} ${response.statusText}`);
        return [];
    }

    if (response.data.status !== "success") {
        log(`Error fetching news: ${response.data.status}`);
        return [];
    }

    return response.data.results;
}

/*
module.exports = async function getNews(term = null, limit = 100) {

    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}&pageSize=${limit}`

    log(`Fetching news from ${url}...`);
    const response = await axios.get(url);
    if (response.status !== 200) {
        log(`Error fetching news: ${response.status} ${response.statusText}`);
        return [];
    }

    if (response.data.status !== "ok") {
        log(`Error fetching news: ${response.data.status}`);
        return [];
    }

    return response.data.articles;
}
*/
/*
module.exports = async function getNews(term, limit = 100) {
    if (!term) throw new Error(`No search term provided!`);

    const countries = "us";
    const earliest = "2023-05-03 00:00:00";
    const latest = "2023-05-03 23:23:59";
    const url = `https://api.worldnewsapi.com/search-news?api-key=${process.env.WORLDNEWS_API_KEY}&source-countries=${countries}&language=en&sort=publish-time&sort-direction=DESC&number=${limit}&term=${term}`

    log(`Fetching news from ${url}...`);
    const response = await axios.get(url);
    if (response.status !== 200) {
        log(`Error fetching news: ${response.status} ${response.statusText}`);
        return [];
    }

    return response.data.news;
}

*/