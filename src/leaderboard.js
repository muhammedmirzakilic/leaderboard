const enums = require("./enums");
const utils = require("./utils");
const { leaderboardDB, matchDB } = require("./redis");
const config = require("./config");

const leaderboard = async (event) => {
  const { start, end } = event.queryStringParameters;
  const teams = await getTeams(start, end);
  const teamsWithMatchCounts = await addMatchCountToTeams(teams);
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(teamsWithMatchCounts),
  };
};

const getTeams = async (start, end) => {
  const zrevrange = await leaderboardDB.zrevrange(
    enums.leaderboardKey,
    start - 1,
    end - 1,
    "WITHSCORES"
  );
  const teams = [];
  for (let index = 0; index < zrevrange.length; index++) {
    const teamId = zrevrange[index++];
    const { points, average } = utils.splitPointsAndAverage(zrevrange[index]);
    teams.push({
      teamId,
      totalPoints: points,
      average,
    });
  }
  return teams;
};

const addMatchCountToTeams = async (teams) => {
  const promises = [];
  for (let index = 0; index < teams.length; index++) {
    promises.push(
      matchDB.hget(enums.teamKey(teams[index].teamId), enums.matchCount)
    );
    if (promises.length % config.redis.maxConcurrentRequestCount === 0) {
      await Promise.all(promises);
    }
  }
  const matchCounts = await Promise.all(promises);
  for (let index = 0; index < teams.length; index++) {
    teams[index].matchCount = +matchCounts[index];
  }
  return teams;
};

module.exports = {
  handler: leaderboard,
};
