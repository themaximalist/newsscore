const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const { Scrape } = require("@themaximalist/scrape.js");

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => { });

function findTopStoryLinks(html) {
    if (!html) throw new Error("techmeme findTopStoryLinks requires html");

    const dom = new JSDOM(html, { virtualConsole });
    const selectors = [
        "#topcol1 .ii a.ourh",
        "#botcol1 .ii a.ourh",
        "#botcol2 .ii a.ourh",
        "#topcol3 .ii a.ourh",
    ];

    const links = Array.from(dom.window.document.querySelectorAll(selectors.join(",")));
    if (links.length == 0) {
        throw new Error("techmeme findTopStoryLinks found no links");
    }

    return Array.from(links).map(link => link.href);
}

async function techmeme() {
    const url = "https://www.techmeme.com/";
    const result = await Scrape(url, { extract: false });
    return findTopStoryLinks(result.html);
}

techmeme.service = "techmeme";
techmeme.category = "technology";

module.exports = techmeme;