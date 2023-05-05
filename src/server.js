const log = require("debug")("newsscore:server");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.locals = {
  NODE_ENV: process.env.NODE_ENV,
};
app.set("views", "src/views");

app.start = async function () {
  const port = process.env.PORT || 3000;
  await app.listen(port);
  log("Server listening on port " + port);
};

module.exports = app;
const controllers = require("./controllers");
