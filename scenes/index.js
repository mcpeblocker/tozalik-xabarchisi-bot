const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
  require("./start"),
  require("./main"),
  ...require("./common"),
  ...require("./inform"),
  ...require("./tasks"),
  ...require("./statistics"),
]);

module.exports = stage;
