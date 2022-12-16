const mongoose = require("mongoose");
const config = require("../utils/config");
const logger = require("../utils/logger");

mongoose.connect(config.databaseUri, (error) => {
  if (error) {
    logger.error(`Couldn't connect to the database: ${error.message}`, {
      type: "database",
    });
    process.exit(1);
  }
  logger.info("Database connection established!");
});
