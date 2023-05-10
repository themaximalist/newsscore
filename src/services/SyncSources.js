const log = require("debug")("newsscore:SyncSources");
const CreateStory = require("./CreateStory")
const Story = require("../models/story");
const Sync = require("../models/sync");
const { DateTime } = require("luxon");
const FingerprintLink = require("./FingerprintLink");
const { Scrape } = require("@themaximalist/scrape.js");
const SourceFromURL = require("./SourceFromURL");

const { techmeme, hackernews, reddit } = require("../sources");

const sources = [hackernews, techmeme, reddit];

async function SyncSource(source) {

    const sync = await Sync.findOne({ where: { service: source.service } });
    if (sync) {
        const last_synced = DateTime.fromJSDate(sync.updatedAt);
        const mins = DateTime.now().diff(last_synced, "minutes").minutes;
        if (mins < process.env.SYNC_SLEEP_SOURCE_MINS) {
            log(`skipping source ${source.service} last synced ${mins.toFixed(2)} minutes ago...`);
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

    await Sync.upsert({ service: source.service, runs: sync ? sync.runs + 1 : 1 });

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