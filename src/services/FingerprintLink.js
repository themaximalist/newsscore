const { sha256 } = require("../utils");

module.exports = async function (link) {
    return await sha256(link);
}