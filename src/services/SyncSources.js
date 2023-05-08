const log = require("debug")("newsscore:SyncSources");
const CreateStory = require("./CreateStory")
const Story = require("../models/story");
const FingerprintLink = require("./FingerprintLink");
const { Scrape } = require("@themaximalist/scrape.js");
const SourceFromURL = require("./SourceFromURL");

const Cache = require("file-system-cache").default;

const cache = Cache({ ns: "syncsources" });

const { techmeme, hackernews, reddit } = require("../sources");

const sources = [hackernews, techmeme, reddit];

const SYNC_SLEEP = 60 * 60;

async function SyncSource(source) {

    const last_synced = await cache.get(source.service);
    if (last_synced) {
        const diff = (Date.now() - last_synced) / 1000;
        if (diff < SYNC_SLEEP) {
            log(`skipping source ${source.service} last synced ${(diff / 60).toFixed(2)} minutes ago...`);
            return false;
        }
    }

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

    await cache.set(source.service, Date.now());

    return true;
}

module.exports = async function SyncSources(date = null) {
    log(`syncing sources...`);
    for (const source of sources) {
        if (await SyncSource(source)) {
            break;
        }
    }
    log(`finished syncing sources...`);
}