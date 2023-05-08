module.exports = function setup(app) {
    app.get("/", require("./home"));
    app.get("/leaderboard", require("./leaderboard"));
    app.get("/about", require("./about"));
    app.post("/newsletter/signup", require("./newsletter"));
};