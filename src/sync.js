require("dotenv").config();
const log = require("debug")("newsscore:sync");

const SyncNews = require("./services/SyncNews");
const SyncScores = require("./services/SyncScores");
const SyncContent = require("./services/SyncContent");
const SyncHeadlines = require("./services/SyncHeadlines");
const database = require("./database");
const HighpassFilter = require("./services/HighpassFilter");

const { DateTime } = require("luxon");

async function sync() {
    let date = DateTime.local().minus({ days: 1 }).toISODate();

    log(`running sync`);
    await database.initialize();
    // await SyncNews(date); // TODO: cache sync date...only sync once per 2 hours
    // await HighpassFilter();
    // await SyncContent();
    // await SyncScores();
    await SyncHeadlines();
}

// TODO: LowpassFilter ...second chance to find interesting stories above <500 

sync();