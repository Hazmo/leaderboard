const express = require("express");
const fs = require("graceful-fs");

const fileUtils = require("./utils/fileUtils.js");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send(fileUtils.getLeaderboard()));

app.get("/games/won", (req, res) => {
  leaderboard = fileUtils.getLeaderboard();

  win_count = {};

  leaderboard.sessions.forEach(session => {
    session.matches.forEach(match => {
      match.games.forEach(game => {
        if (!win_count[game.winner]) {
          win_count[game.winner] = 1;
          console.log(win_count)
        } else {
          win_count[game.winner] += 1;
        }
      });
    });
  });

  res.send(win_count)
});

app.post("/", (req, res) => {
  console.log(req.body);

  fileUtils.saveLeadboardBackup();

  fileUtils.saveLeaderboard(req.body);
  return res.send("POST called!");
});

app.post("/session", (req, res) => {
  console.log(req.body);
  fileUtils.saveLeadboardBackup();

  session = req.body;
  session.date = Date.now();

  leaderboard = fileUtils.getLeaderboard();

  console.log(leaderboard.toString());

  leaderboard.sessions.push(session);
  fileUtils.saveLeaderboard(leaderboard);
  return res.send(`Success! Saved session: ${session.toString()}`);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
