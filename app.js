const express = require("express");
const fs = require("graceful-fs");
const EloRating = require("elo-rating");

const fileUtils = require("./utils/fileUtils.js");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  const leaderboard = await fileUtils.getLeaderboard();

  res.send(leaderboard);
});

app.get("/elo/games", async (req, res) => {
  const leaderboard = await fileUtils.getLeaderboard();

  elo_rating = {};

  leaderboard.sessions.forEach(session => {
    session.matches.forEach(match => {
      match.games.forEach(game => {

        const winner = game.winner;
        const loser = game.loser;

        if (!elo_rating[winner]) elo_rating[winner] = {};
        if (!elo_rating[loser]) elo_rating[loser] = {};

        const winner_rating = elo_rating[winner] && elo_rating[winner].rating || 1500;
        const loser_rating = elo_rating[loser] && elo_rating[loser].rating || 1500;

        // let winner_change = elo_rating[game.winner].change || 0;
        // let loser_change = elo_rating[game.loser].change || 0;

        result = EloRating.calculate(winner_rating, loser_rating, true);

        elo_rating[winner].rating = result.playerRating;
        elo_rating[loser].rating = result.opponentRating;

        console.log(elo_rating)
      });
    });
  });

  res.send(elo_rating);
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

  res.send(win_count);
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
