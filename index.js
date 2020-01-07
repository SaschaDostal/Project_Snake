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
  res.render("pages/index.ejs");
});

app.get("/pages/highscore.ejs", (req, res) => {
  db.all("SELECT * FROM Leaderboard ORDER BY Highscore DESC", (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.render("pages/highscore.ejs", {
        data: rows
      });
    }
  });
});

app.post("/login", async (req, res) => {
  let firstTen = [{ Username: "Be the first ", Highscore: "\u221E" }];
  db.all(
    "SELECT * FROM Leaderboard ORDER BY Highscore DESC",
    async (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        let length = rows.length;
        if (length > 10) {
          for (var i = 0; i < 10; i++) {
            firstTen[i] = rows[i];
          }
        } else {
          for (var i = 0; i < length; i++) {
            firstTen[i] = rows[i];
          }
        }
        console.log("firstTen: " + firstTen);

        res.render("pages/index.ejs", {
          data: firstTen,
          username: req.body.uname
        });
      }
    }
  );
});

app.post("/saveScore", async (req, res) => {
  let yourID;
  db.run(
    "INSERT INTO Leaderboard(Username, Highscore) VALUES (?, ?);",
    [req.body.uname, req.body.Score],
    function(err) {
      if (err) {
        res.render("pages/index.ejs", { error: true });
      } else {
        db.all("SELECT * FROM Leaderboard ORDER BY Highscore DESC", (err, rows) => {
          if (err) {
            console.log(err);
          } else {
            res.render("pages/highscore.ejs", {
              data: rows,
              yourID: this.lastID
            });
          }
        });
      }
    }
  );
});

app.get("/pages/index.ejs", (req, res) => {
  let firstTen = [
    { Username: "Be the first ", Highscore: "\u221E" }
  ]; /*= [null, null, null, null, null, null, null, null, null, null]*/
  db.all(
    "SELECT * FROM Leaderboard ORDER BY Highscore DESC",
    async (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        let length = rows.length;
        if (length > 10) {
          for (var i = 0; i < 10; i++) {
            firstTen[i] = rows[i];
          }
        } else if (length != 0) {
          for (var i = 0; i < length; i++) {
            firstTen[i] = rows[i];
          }
        } else {
          console.log("firstTen: " + firstTen);

          res.render("pages/index.ejs", {
            data: firstTen
          });
        }
      }
    }
  );
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}…`);
});

module.exports = server;

function showDefeat() {
  document.querySelector("content").style.display = "flex";
}
