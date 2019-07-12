exports.gamesWon = () => {
  win_count = {};

  //todo use compute on games
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

  return win_count;
};

exports.computeOnGames = (leaderboard, callback) => {
    leaderboard.sessions.forEach(session => {
      session.matches.forEach(match => {
        match.games.forEach(game => {
          callback(session, match, game);
        });
      });
    });
  };
