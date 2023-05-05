const log = require("debug")("newsscore:news");

const axios = require("axios");
const { DateTime } = require("luxon");

const { querystring } = require("../utils");

module.exports = async function* getNews(options = null) {
    if (!options) options = {};

    if (!options.apikey) options.apikey = process.env.NEWSDATA_API_KEY;
    if (!options.language) options.language = "en";
    if (!options.country) options.country = "us";
    if (!options.category) options.category = "top";
    if (!options.date) options.date = DateTime.local().toISODate();

    options.from_date = options.date;
    options.to_date = options.date;
    delete options["date"];

    while (true) {
        const url = `https://newsdata.io/api/1/archive?${querystring(options)}`;

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

        for (const story of response.data.results) {
            yield story;
        }

        if (!response.data.nextPage) {
            log(`finished fetching news`);
            return;
        }

        options.page = response.data.nextPage;
    }
}