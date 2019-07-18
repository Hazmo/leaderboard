import EloRating from "elo-rating";
import leaderboardUtils from "../utils/leaderboardUtils.js";
import { Leaderboard, Match } from "../ts/app_types";
import { Type } from "../ts/app_enums.js";



const DEFAULT_RATING = 1500;
const DEFAULT_CHANGE = 0;

const getEloForGames = (leaderboard: Leaderboard) => {
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

      let result = EloRating.calculate(winner_rating, loser_rating, true);

      elo_rating[winner].change += result.playerRating - winner_rating;
      elo_rating[loser].change += result.opponentRating - loser_rating;

      // console.log(elo_rating);
    });

    Object.keys(players).forEach(player => {
      elo_rating[player].rating += elo_rating[player].change;
      elo_rating[player].change = 0;
    });
  });

  return elo_rating;
};

const getEloForTournaments = (leaderboard: Leaderboard) => {
  //init player ratings
  const players = initPlayerRatingsForTournament(leaderboard);
  const elo_rating = { ...players };

  // const elo_history = { ...initPlayerRatingsForTournament(leaderboard) };

  // Object.keys(players).forEach(player => {
  //   elo_history[player].history = [];
  //   delete elo_history[player].rating;
  //   delete elo_history[player].change;
  // });

  // console.log(elo_history);
  // console.log(elo_rating);

  leaderboard.sessions
    .filter(session => session.type === Type.TOURNAMENT)
    .forEach(session => {
      console.log(session);
      let winner: string;
      let loser: string;
      session.matches.forEach(match => {
        //work out winner
        const match_result = getResultForMatch(match, session.best_of);
        //calc elo change

        winner = match_result.winner;
        loser = match_result.loser;

        const winner_rating = elo_rating[winner].rating;
        const loser_rating = elo_rating[loser].rating;

        let result = EloRating.calculate(winner_rating, loser_rating, true);

        elo_rating[winner].change += result.playerRating - winner_rating;
        elo_rating[loser].change += result.opponentRating - loser_rating;

        // console.log(elo_rating);
      });

      Object.keys(players).forEach(player => {
        elo_rating[player].rating += elo_rating[player].change;
        // elo_history[player].history.push({
        //   rating: elo_rating[player].rating,
        //   change: elo_rating[player].change
        // });
        elo_rating[player].change = 0;
      });

      // console.log(JSON.stringify(elo_history));
    });

  return elo_rating;
};

const getResultForMatch = (match: Match, best_of = 3) => {
  const games_needed_to_win = Math.ceil(best_of / 2);

  const win_count = {};
  const players = getPlayersForMatch(match);

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
  console.log("no winners????");
};

const getPlayersForMatch = (match: Match) => {
  return [match.games[0].winner, match.games[0].loser];
};

const initPlayerRatingsForTournament = (leaderboard: Leaderboard) => {
  const players = {};

  leaderboardUtils.computeOnGames(leaderboard, (_, __, game) => {
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

const getRatingOrDefault = (elo_rating: any, player: string) => {
  if (!elo_rating[player]) {
    elo_rating[player] = {};
  }

  if (elo_rating[player].rating) {
    return elo_rating[player].rating;
  } else {
    return DEFAULT_RATING;
  }
};

export default {
  getEloForGames,
  getEloForTournaments
};
