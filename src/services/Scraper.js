const log = require("debug")("newsscore:extractURL");

const axios = require("axios");
const request = require("request");
const { querystring } = require("../utils");

async function extractor(url) {
    log(`scraping with extractor API ${url}...`)
    const endpoint = `https://extractorapi.com/api/v1/extractor/?apikey=${process.env.EXTRACTOR_API_KEY}&url=${encodeURIComponent(url)}`;
    const response = await axios.get(endpoint);

    if (response.status !== 200) throw new Error(`Error scraping ${url}: ${response.status} ${response.statusText}`)
    if (!response.data.text || response.data.text.trim().length === 0) throw new Error(`Error scraping ${url}: no content found`)

    const data = {
        content: response.data.text,
    };

    if (response.data.images && response.data.images.length > 0) {
        data.image_url = response.data.images[0];
    }

    return data;
}

async function diffbot(url) {
    const params = {
        url,
        token: process.env.DIFFBOT_API_KEY,
        timeout: 15000
    };

    const endpoint = `https://api.diffbot.com/v3/analyze?${querystring(params)}`;
    log(`scraping with diffbot API ${url}...`);
    const response = await axios.get(endpoint);

    if (response.status !== 200) throw new Error(`Error scraping ${url}: ${response.status} ${response.statusText}`)
    if (!response.data.objects || response.data.objects.length == 0) {
        console.log(JSON.stringify(response.data, null, 4));
        throw new Error(`Error scraping ${url}: no content found`);
    }

    const article = response.data.objects[0];
    if (!article.text) {
        console.log(JSON.stringify(article, null, 4));
        throw new Error(`Error scraping ${url}: no content found`)
    }

    const data = {
        content: article.text
    };

    if (article.images && article.images.length > 0) {
        data.image_url = article.images[0].url;
    }

    if (article.resolvedPageUrl) {
        data.url = article.resolvedPageUrl;
    }

    return data;
}

module.exports = async function scrape(url) {
    try {
        return await diffbot(url);
    } catch (e) {
        throw e;
        log(`error scraping diffbot ${url}: ${e.message} ...trying extractor`);

        try {
            return await extractor(url);
        } catch (e) {
            throw e;
            log(`error scraping extractor ${url}: ${e.message}`);
            return null;
        }
    }
}