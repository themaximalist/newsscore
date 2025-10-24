function querystring(params) {
    return Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
}

function isValidURL(str) {
    try {
        new URL(str);
        return true;
    } catch (e) {
        return false;
    }
}

const { Sha256 } = require("@aws-crypto/sha256-js");
async function sha256(input) {
    const hash = new Sha256();
    hash.update(input);
    const digest = await hash.digest();
    const buffer = Buffer.from(digest);
    return buffer.toString("hex");
}

const DateTime = require("luxon").DateTime;
function newsDateToUTC(date) {
    return DateTime.fromISO(date.replace(" ", "T"), { zone: "GMT" }).toISO();
}

function parseCodeBlock(blockType) {
    return function (content) {
        try {
            return content.split("```" + blockType)[1].split("```")[0].trim();
        } catch (e) {
            log.error(`error parsing code block of type ${blockType} from content`, content);
            throw e;
        }
    }
}

function parseJSON(content) {
    try {
        return JSON.parse(content);
    } catch (e) {
        const parser = parseCodeBlock("json");
        return JSON.parse(parser(content));
    }
}

module.exports = {
    querystring,
    sha256,
    newsDateToUTC,
    isValidURL,
    parseCodeBlock,
    parseJSON,
}
