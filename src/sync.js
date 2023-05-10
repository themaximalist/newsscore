require("dotenv").config();
const log = require("debug")("newsscore:sync");

const SyncScores = require("./services/SyncScores");
const SyncSources = require("./services/SyncSources");
const SyncHeadlines = require("./services/SyncHeadlines");
const database = require("./database");
const HighpassFilter = require("./services/HighpassFilter");
const SyncTweets = require("./services/SyncTweets");

async function sync() {
    log(`running sync`);
    await database.initialize();
    await SyncSources();
    await HighpassFilter();
    await SyncScores();
    await SyncHeadlines();
    // await SyncTweets();
    log(`finished sync`);
    process.exit();
}

sync();