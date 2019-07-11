const express = require("express");
const fileUtils = require("./utils/fileUtils.js");
const eloUtils = require("./utils/eloUtils.js");
const leaderboardUtils = require("./utils/leaderboardUtils.js");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  const leaderboard = await fileUtils.getLeaderboard();

  res.send(leaderboard);
});

app.get("/elo/games", async (req, res) => {
  const leaderboard = await fileUtils.getLeaderboard();
  elo_rating = eloUtils.getEloForGames(leaderboard);
  res.send(elo_rating);
});

app.get("/elo/tournament", async (req, res) => {
  const leaderboard = await fileUtils.getLeaderboard();
  elo_rating = eloUtils.getEloForTournaments(leaderboard);
  res.send(elo_rating);
})

app.get("/games/won", async (req, res) => {
  const leaderboard = await fileUtils.getLeaderboard();
  const win_count = leaderboardUtils.gamesWon(leaderboard);
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
