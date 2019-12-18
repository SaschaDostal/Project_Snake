const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyparser = require("body-parser");

const db = new sqlite3.Database("./db/Leaderboard");

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.set("view engine", "ejs");
app.use("/public", express.static(process.cwd() + "/public"));

app.use("/views", express.static(process.cwd() + "/views"));

app.get("/", (req, res) => {
  res.render("pages/Loginscreen.ejs");
});

app.post("/login", async (req, res) => {
  db.run(
    "INSERT INTO Leaderboard(Username, Highscore) VALUES (?, ?);",
    [req.body.uname, 0],
    err => {
      if (err) {
        res.render("pages/Loginscreen.ejs", { error: true });
      } else {
        res.redirect("pages/index.ejs");
      }
    }
  );
});

app.get("/pages/index.ejs", (req, res) => {
  res.render("pages/index.ejs");
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}…`);
});

module.exports = server;

function showDefeat() {
  document.querySelector("content").style.display = "flex";
}
