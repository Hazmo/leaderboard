const express = require("express");
const fs = require("graceful-fs");

const fileUtils = require("./utils/fileUtils.js");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {

  const leaderboard = await fileUtils.getLeaderboard();

  res.send(leaderboard);
});

app.get("/games/won", async (req, res) => {
  const leaderboard = await fileUtils.getLeaderboard();

  win_count = {};

  leaderboard.sessions.forEach(session => {
    session.matches.forEach(match => {
      match.games.forEach(game => {
        if (!win_count[game.winner]) {
          win_count[game.winner] = 1;
        } else {
          win_count[game.winner] += 1;
        }
      });
    });
  });

  res.send(win_count)
});

app.post("/", async (req, res) => {
  console.log(req.body);

  await fileUtils.saveLeadboardBackup();

  fileUtils.saveLeaderboard(req.body);
  return res.send("POST called!");
});

app.post("/session", async (req, res) => {
  console.log(req.body);
  const leaderboard = await fileUtils.saveLeadboardBackup();

  session = req.body;
  session.date = Date.now();

  console.log(leaderboard.toString());

  leaderboard.sessions.push(session);
  fileUtils.saveLeaderboard(leaderboard);
  return res.send(`Success! Saved session: ${session.toString()}`);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
