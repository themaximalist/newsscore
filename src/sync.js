require("dotenv").config();
const log = require("debug")("newsscore:sync");
const SyncNews = require("./services/SyncNews");
const SyncScores = require("./services/SyncScores");
const database = require("./database");

async function sync() {
    log(`running sync`);
    await database.initialize();
    // await SyncNews();
    await SyncScores();
    // await SyncHeadlines();
}

sync();