const log = require("debug")("newsscore:SubmitNews");

const { Scrape } = require("@themaximalist/scrape.js");
const { Story } = require("../models");
const FingerprintLink = require("./FingerprintLink");
const SourceFromURL = require("./SourceFromURL");
const ScoreAgent = require("../agents/ScoreAgent");
const CreateStory = require("./CreateStory");
const HeadlineAgent = require("../agents/HeadlineAgent");

module.exports = async function (link) {
    log(`submitting news ${link}`);

    const fingerprint = await FingerprintLink(link);

    let story = await Story.findOne({ where: { fingerprint } });
    if (story) {
        log(`story already exists ${link}`);
        throw new Error(`Story already exists on News Score with a score of ${story.score}`);
    }

    const result = await Scrape(link);
    if (!result) {
        log(`unable to scrape ${link}`);
        throw new Error(`Unable to scrape story, please try again or with another link`);
    }

    result.category = "user-contributed";
    result.service = "newsscore";
    result.source = SourceFromURL(result.url);

    log(`scraped story ${result.url}`);

    const fields = {
        title: result.title,
        category: result.category,
        source: result.source,
        url: result.url,
    };

    if (result.content) fields.content = result.content.slice(0, 4000);
    if (result.description) fields.description = result.description;

    const score = await ScoreAgent(fields);
    log(`scored ${result.url} to ${score}`);

    if (score >= process.env.NEWS_SCORE_CUTOFF) {
        const headline = await HeadlineAgent(fields);
        log(`interesting story found...rewrote '${result.title}' to '${headline}'`);
        fields.headline = headline;
    }

    fields.score = score;
    fields.service = result.service;
    fields.final = true;

    story = await CreateStory(fields);
    if (!story) {
        log(`failed to create story ${link}`);
        throw new Error(`Failed to create story, please try again or with another link`);
    }

    return story;
}