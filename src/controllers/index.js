module.exports = function setup(app) {
    app.get("/", require("./home"));
    app.post("/newsletter/signup", require("./newsletter"));
};