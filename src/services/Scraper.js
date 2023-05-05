const log = require("debug")("newsscore:extractURL");

const axios = require("axios");

module.exports = async function scrape(url) {
    try {
        log(`scraping ${url}...`)
        const endpoint = `https://extractorapi.com/api/v1/extractor/?apikey=${process.env.EXTRACTOR_API_KEY}&url=${encodeURIComponent(url)}`;
        const response = await axios.get(endpoint);

        if (response.status !== 200) throw new Error(`Error scraping ${url}: ${response.status} ${response.statusText}`)
        if (!response.data.content || response.data.content.trim().length === 0) throw new Error(`Error scraping ${url}: no content found`)

        return response.data;
    } catch (e) {
        throw e;
        log(`error scraping ${url}: ${e.message}`);
        return null;
    }
}