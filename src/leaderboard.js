// const middy = require("@middy/core");
// const httpJsonBodyParser = require("@middy/http-json-body-parser");
const enums = require("./enums");
const utils = require("./utils");
const { leaderboardDB } = require("./redis");

const leaderboard = async (event) => {
  const { start, end } = event.queryStringParameters;
  const zrevrange = await leaderboardDB.zrevrange(
    enums.leaderboardKey,
    start - 1,
    end - 1,
    "WITHSCORES"
  );
  const leaderboard = [];
  for (let index = 0; index < zrevrange.length; index++) {
    const teamId = zrevrange[index++];
    const { points, average } = utils.splitPointsAndAverage(zrevrange[index]);
    leaderboard.push({
      teamId,
      totalPoints: points,
      average,
    });
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      leaderboard,
    }),
  };
};

module.exports = {
  handler: leaderboard,
};
