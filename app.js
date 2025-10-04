const express = require("express");

const app = express();

app.get("/api/test", (req, res, next) => {
  console.log("!!!");
  res.status(200).send("!!!");
});

module.exports = app;
