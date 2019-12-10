const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/users.db");

const port = process.env.PORT || 3000;
const app = express();

app.set("view engine", "ejs");
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", (req, res) => {
  res.render("pages/index.ejs");
});

app.post('', async (req, res) =>{
  if (/*req.body.*/username && /*req.body.*/password) {
    db.run("INSERT INTO users(username, password) VALUES (?, ?);", [/*req.body.*/username, /*req.body.*/message], err => {
      if (err) {
        res.render("");
      } else {
        res.redirect("");
      }
    });
  } else {
    res.render("");
  }
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}…`);
});

module.exports = server;
