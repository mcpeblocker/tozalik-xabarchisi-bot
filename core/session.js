const config = require("../utils/config");

const RedisSession = require("telegraf-session-redis");
const { session: memorySession } = require("telegraf");

const session =
  config.sessionType === "redis"
    ? new RedisSession({
        store: {
          host: config.redisHost || "127.0.0.1",
          port: config.redisPort || 6379,
        },
      })
    : memorySession();

module.exports = session;
