const { leaderboardDB, matchDB } = require("./redis");

//to be able to test leaderboard with multiple cases
//delete the previous data
const flushDb = async (event) => {
  await matchDB.flushdb();
  await leaderboardDB.flushdb();
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "success",
    }),
  };
};

module.exports = {
  handler: flushDb,
};
