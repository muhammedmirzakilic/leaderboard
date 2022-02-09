//serverless offline env vars issue workaround
const host =
  process.env.REDIS_HOST === "[object Object]"
    ? "localhost"
    : process.env.REDIS_HOST;
const port =
  process.env.REDIS_PORT === "[object Object]" ? 6379 : process.env.REDIS_PORT;

module.exports = {
  redis: {
    host: host,
    port: port,
    password: process.env.REDIS_PASSWORD || "",
    matchDB: process.env.REDIS_MATCH_DB || 0,
    leaderboardDB: process.env.REDIS_LEADERBOARD_DB || 1,
    maxConcurrentRequestCount:
      process.env.REDIS_MAX_CONCURRENT_REQUEST_COUNT || 1000,
  },
};
