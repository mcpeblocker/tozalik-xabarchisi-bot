const express = require("express");
const bot = require("./core/bot");
const session = require("./core/session");
const auth = require("./middlewares/auth");
const stage = require("./scenes");
const config = require("./utils/config");
const logger = require("./utils/logger");
const { handleVerification } = require("./utils/verification");

// Middlewares
bot.use(session);
bot.use((ctx, next) => {
  ctx.session = ctx.session ?? {};
  next();
});
bot.use(auth);
bot.use(stage.middleware());
bot.start((ctx) => ctx.scene.enter("start"));

handleVerification();

// Error handling
bot.catch((error) => {
  logger.error(`BotError: ${error.message}`, { type: "bot" });
});
process.on("unhandledRejection", (reason, promise) => {
  console.log(reason, promise);
  logger.error(`Rejection: ${reason}`, { type: "rejection" });
});
process.on("uncaughtException", (error) => {
  logger.error(`Exception: ${error.message}`, { type: "exception" });
});

// Launching
require("./database");

const app = express();

if (config.isProduction) {
  logger.info("Production mode is ON");
  // webhook
  launchWebhook();
  logger.info(`Bot launched with webhook`);
} else {
  logger.info("Development mode is ON");
  // long-polling
  bot.launch();
  logger.info(`Bot launched with long polling`);
}

async function launchWebhook() {
  const webhook = await bot.createWebhook({ domain: config.webhookDomain });
  app.get("/ping", (req, rep) => rep.send("Pong!"));
  app.use(webhook);
  app.listen(config.port, () => {
    logger.info(`Production server is listening on port ${config.port}`);
  });
}
