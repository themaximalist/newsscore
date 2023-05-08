const { isValidURL } = require("../utils");
const SubmitNews = require("../services/SubmitNews");
const { Story } = require("../models");

module.exports = async function (req, res) {
    let url = req.body.url;

    try {
        if (!url) throw new Error("URL is required");
        if (!isValidURL(url)) throw new Error("URL is invalid");
        const story = await SubmitNews(url);
        if (!story) throw new Error("Failed to submit story");
        res.render("partials/_submit_success", { story });
    } catch (e) {
        const error = e.message;
        res.render("partials/_submit", { error, url });
    }
}