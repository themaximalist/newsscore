const log = require("debug")("newsscore:SyncSources");
const techmeme = require("../sources/techmeme");
const CreateStory = require("./CreateStory")
const Story = require("../models/story");
const FingerprintLink = require("./FingerprintLink");
const { Scrape } = require("@themaximalist/scrape.js");
const SourceFromURL = require("./SourceFromURL");
const hackernews = require("../sources/hackernews");

const sources = [hackernews]; //, techmeme];

async function SyncSource(source) {
    log(`syncing source ${source.service}...`);

    const links = await source();
    log(`source ${source.service} found ${links.length} links...`);

    for (const link of links) {
        log(`processing ${source.service} link ${link}`);

        const fingerprint = await FingerprintLink(link);;

        let story = await Story.findOne({ where: { fingerprint } });
        if (story) {
            log(`skipping story already exists ${link}`);
            continue;
        }

        const result = await Scrape(link);
        if (!result) {
            log(`skipping story failed to scrape ${link}`);
            continue;
        }

        result.category = source.category;
        result.service = source.service;
        result.source = SourceFromURL(result.url);

        story = await CreateStory(result);
        if (!story) {
            log(`FAIL: failed to create story ${link}`);
            continue;
        }

        log(`created story from ${story.source} '${story.title}'`)
    }
}

module.exports = async function SyncSources(date = null) {
    log(`syncing sources...`);
    for (const source of sources) {
        await SyncSource(source);
    }
}