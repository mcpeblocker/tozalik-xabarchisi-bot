require("dotenv").config();
const process = require("node:process");

const config = {
  isProduction: process.env["NODE_ENV"] === "production",
  token: process.env["BOT_TOKEN"],
  sessionType: process.env["SESSION_TYPE"],
  redisHost: process.env["REDIS_HOST"],
  redisPort: process.env["REDIS_PORT"],
  webhookDomain: process.env["WEBHOOK_DOMAIN"],
  port: process.env["PORT"],
  databaseUri: process.env["DATABASE_URI"],
};

module.exports = config;
