const dayjs = require("dayjs");
const winston = require("winston");
const config = require("./config");
const path = require("node:path");

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: {
    time: dayjs().format("DD-MM-YYYY HH:mm:ss"),
  },
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "..", "logs", "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "..", "logs", "combined.log"),
    }),
  ],
});

if (!config.isProduction) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = logger;
