require("dotenv").config();
const log = require("debug")("newsscore:sync");

const SyncScores = require("./services/SyncScores");
const SyncSources = require("./services/SyncSources");
const SyncHeadlines = require("./services/SyncHeadlines");
const database = require("./database");
const HighpassFilter = require("./services/HighpassFilter");

const { DateTime } = require("luxon");

async function sync() {
    let date = DateTime.local().minus({ days: 1 }).toISODate();

    log(`running sync`);
    await database.initialize();
    await SyncSources(); // TODO: put on cache
    await HighpassFilter();
    await SyncScores();
    await SyncHeadlines();
}

// TODO: LowpassFilter ...second chance to find interesting stories above <500 

sync();