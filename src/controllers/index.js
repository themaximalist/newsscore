module.exports = function setup(app) {
    app.get("/", require("./home"));
    app.get("/leaderboard", require("./leaderboard"));
    app.get("/submit", require("./submit"));
    app.get("/about", require("./about"));
    app.post("/newsletter/signup", require("./newsletter"));
    app.post("/submit/news", require("./submit_news"));
    app.get("/status", require("./status"));
};