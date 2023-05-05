require("dotenv").config();
const log = require("debug")("newsscore:index");
const database = require("./database");
const server = require("./server");

async function main() {
    await database.initialize();
    await server.start();
}

main();