const express = require("express");

const port = process.env.PORT || 3000;
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/index.ejs");
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}…`);
});

module.exports = server;
