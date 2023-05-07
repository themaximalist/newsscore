module.exports = function SourceFromURL(url) {
    try {
        const { hostname } = new URL(url);
        if (hostname.indexOf("www.") == 0) {
            return hostname.slice(4);
        }

        return hostname;
    } catch (e) {
        throw new Error(`cannot find SourceFromURL ${url}`)
    }
}