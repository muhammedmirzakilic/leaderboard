module.exports = {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || "",
    matchDB: process.env.REDIS_MATCH_DB || 0,
    leaderboardDB: process.env.REDIS_LEADERBOARD_DB || 1,
  },
};
