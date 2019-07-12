const EloRating = require("elo-rating");
const leaderboardUtils = require("./leaderboardUtils.js");

const DEFAULT_RATING = 1500;
const DEFAULT_CHANGE = 0;

exports.getEloForGames = leaderboard => {
  const elo_rating = {};

  leaderboardUtils.computeOnGames(leaderboard, (session, match, game) => {
    const winner = game.winner;
    const loser = game.loser;

    const winner_rating = getRatingOrDefault(elo_rating, winner);
    const loser_rating = getRatingOrDefault(elo_rating, loser);

    result = EloRating.calculate(winner_rating, loser_rating, true);

    elo_rating[winner].rating = result.playerRating;
    elo_rating[loser].rating = result.opponentRating;

    console.log(elo_rating);
  });

  return elo_rating;
};

exports.getEloForTournaments = leaderboard => {
  //init player ratings
  const players = initPlayerRatingsForTournament(leaderboard);
  const elo_rating = { ...players };

  leaderboard.sessions.forEach(session => {
    let winner;
    let loser;
    session.matches.forEach(match => {
      //work out winner
      const match_result = getResultForMatch(match, session.best_of);
      //calc elo change

      winner = match_result.winner;
      loser = match_result.loser;

      const winner_rating = elo_rating[winner].rating;
      const loser_rating = elo_rating[loser].rating;

      result = EloRating.calculate(winner_rating, loser_rating, true);

      elo_rating[winner].change += result.playerRating - winner_rating;
      elo_rating[loser].change += result.opponentRating - loser_rating;

      // console.log(elo_rating);
    });

    Object.keys(players).forEach(player => {
      elo_rating[player].rating += elo_rating[player].change;
      elo_rating[player].change = 0;
    });

    // elo_rating[winner].rating += elo_rating[winner].change;
    // elo_rating[loser].rating += elo_rating[loser].change;

    console.log(elo_rating);
    // console.log(elo_rating[winner]);
    // console.log(elo_rating[loser]);

    // elo_rating[winner].change = 0;
    // elo_rating[loser].change = 0;

    //elo change
  });

  return elo_rating;
};

const getResultForMatch = (match, best_of = 3) => {
  const games_needed_to_win = best_of - 1;

  win_count = {};
  players = getPlayersForMatch(match);

  for (let game of match.games) {
    if (!win_count[game.winner]) {
      win_count[game.winner] = 1;
    } else {
      win_count[game.winner] += 1;
    }

    if (win_count[players[0]] === games_needed_to_win) {
      console.log(players[0] + " won!");
      return { winner: players[0], loser: players[1] };
    } else if (win_count[players[1]] === games_needed_to_win) {
      console.log(players[1] + " won!");
      return { winner: players[1], loser: players[0] };
    } else {
      //   console.log(win_count);
      //   console.log(games_needed_to_win);
    }
  }
};

const getPlayersForMatch = match => {
  return [match.games[0].winner, match.games[0].loser];
};

const initPlayerRatingsForTournament = leaderboard => {
  const players = {};

  leaderboardUtils.computeOnGames(leaderboard, (session, match, game) => {
    let winner = game.winner;
    let loser = game.loser;

    if (!players[winner])
      Object.assign(players, {
        [winner]: { rating: DEFAULT_RATING, change: DEFAULT_CHANGE }
      });
    if (!players[loser])
      Object.assign(players, {
        [loser]: { rating: DEFAULT_RATING, change: DEFAULT_CHANGE }
      });
  });

  console.log(players);

  return players;
};

const getRatingOrDefault = (elo_rating, player) => {
  if (!elo_rating[player]) {
    elo_rating[player] = {};
  }

  if (elo_rating[player].rating) {
    return elo_rating[player].rating;
  } else {
    return DEFAULT_RATING;
  }
};
