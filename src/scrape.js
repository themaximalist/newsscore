require("dotenv").config();

const { Scrape } = require("@themaximalist/scrape.js");

async function main() {
    const url = "https://greekreporter.com/2023/05/08/greek-scientists-create-fastest-ever-ai-processor-harnessing-light/";
    const result = await Scrape(url);
    console.log("RESULT");
    console.log(JSON.stringify(result, null, 4));
}

main();
