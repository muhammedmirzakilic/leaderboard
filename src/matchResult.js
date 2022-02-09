const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const { matchDB, leaderboardDB } = require("./redis");
const utils = require("./utils");
const enums = require("./enums");
const matchResult = async (event) => {
  const { home, away } = event.body;
  console.log(home, away);
  let homeScore = 0;
  let awayScore = 0;
  let homeAv = home.goalsScored - away.goalsScored;
  let awayAv = homeAv * -1;
  if (homeAv > awayAv) homeScore = 3;
  else if (homeAv < awayAv) awayScore = 3;
  else {
    homeScore = 1;
    awayScore = 1;
  }
  const promises = [];
  promises.push(
    matchDB
      .multi()
      //there is no requirements for the team's match history.
      //So I just added the match to the match history.
      .lpush(enums.matches, JSON.stringify({ home, away }))
      .hincrby(enums.teamKey(home.teamId), enums.matchCount, 1)
      .hincrby(enums.teamKey(away.teamId), enums.matchCount, 1)
      .exec()
  );
  const homePointRage = utils.combinePointsAndAverage(homeScore, homeAv);
  const awayPointRage = utils.combinePointsAndAverage(awayScore, awayAv);
  promises.push(
    leaderboardDB
      .multi()
      .zincrby(enums.leaderboardKey, homePointRage, home.teamId)
      .zincrby(enums.leaderboardKey, awayPointRage, away.teamId)
      .exec()
  );
  await Promise.all(promises);
  return {
    statusCode: 201,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Match result added successfully",
    }),
  };
};

module.exports = {
  handler: middy(matchResult).use(httpJsonBodyParser()),
};
