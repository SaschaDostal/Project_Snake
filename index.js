const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/Leaderboard");

const port = process.env.PORT || 3000;
const app = express();

app.set("view engine", "ejs");
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", (req, res) => {
  res.render("pages/index.ejs");
});

app.post("login", async (req, res) => {
  if (/*req.body.*/ username) {
    db.run(
      "INSERT INTO Leaderboard(username, highscore) VALUES (?, ?);",
      [/*req.body.*/ username, 0],
      err => {
        if (err) {
          res.render("login", { error: true });
        } else {
          res.redirect("gamePage");
        }
      }
    );
  } else {
    res.render("login", { empty: true });
  }
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}…`);
});

module.exports = server;
