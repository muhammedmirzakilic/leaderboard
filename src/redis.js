const Redis = require("ioredis");
const config = require("./config");
const matchDB = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.matchDB,
});
const leaderboardDB = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.leaderboardDB,
});

module.exports = {
  matchDB,
  leaderboardDB,
};
