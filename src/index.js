require("dotenv").config();
const log = require("debug")("newsscore:index");
const SyncNews = require("./services/SyncNews");
const SyncScores = require("./services/SyncScores");
const database = require("./database");

async function main() {
    await database.initialize();
    // await SyncNews();
    await SyncScores();
}

main();