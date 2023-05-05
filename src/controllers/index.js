module.exports = function setup(app) {
    app.get("/", require("./home"));
};