require("dotenv").config();

const { Scrape } = require("@themaximalist/scrape.js");

async function main() {
    const url = "https://www.the5to9.xyz/p/chesscom-bootstrapping-community-50myear";
    const result = await Scrape(url);
    console.log(JSON.stringify(result, null, 4));
}

main();