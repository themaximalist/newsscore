const log = require("debug")("newsscore:server");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.locals = {
  NODE_ENV: process.env.NODE_ENV,
  DateTime: require("luxon").DateTime,
  NEWS_SCORE_CUTOFF: process.env.NEWS_SCORE_CUTOFF,
};
app.set("view engine", "ejs");
app.set("views", "src/views");

app.start = async function () {
  const port = process.env.PORT || 3000;
  await app.listen(port);
  log("Server listening on port " + port);
};


require("./controllers")(app);

module.exports = app;
